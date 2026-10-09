import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input')?.toUpperCase().trim();
    
    if (!input || !checkInput(input)) {
      return NextResponse.json({ error: 'License plate or VIN is required' }, { status: 400 });
    }
    const type = checkInput(input);
    const carDocRef = doc(db, 'vehicles', input);
    const carSnapshot = await getDoc(carDocRef);

    if (carSnapshot.exists()) {
      const cachedCar = carSnapshot.data();
      if (cachedCar.tekniskedata && cachedCar.registreringsdata && cachedCar.godkjenning) {
        console.log(`Cache data retrieved from Firestore for: ${input}`);
        return NextResponse.json({ source: 'cache', data: cachedCar });
      }
    }

    console.log(`Cache Miss. Querying Statens Vegvesen API for: ${input}`);
    // Fetch raw text data from Statens Vegvesen API
    const svvResponse = await fetch(
      `https://akfell-datautlevering.atlas.vegvesen.no/enkeltoppslag/kjoretoydata?${type}=${encodeURIComponent(input)}`,
      {
      headers: {
        'SVV-Authorization': `Apikey ${process.env.SVV_API_KEY}`,
        'Accept': 'application/json'
      }
      }
    );

    if (!svvResponse.ok) {
      return NextResponse.json({ error: 'Vehicle not found or SVV API error' }, { status: svvResponse.status });
    }


    const rawSvvData = await svvResponse.json();

    if (!rawSvvData.kjoretoydataListe || rawSvvData.kjoretoydataListe.length === 0) {
      return NextResponse.json({ error: 'No vehicle records returned' }, { status: 404 });
    }

    // Safely target the first vehicle object inside the array list
    const targetVehicle = rawSvvData.kjoretoydataListe[0];

    // Restructure the response while retaining complete nested data sections
    const technicalData = targetVehicle.godkjenning?.tekniskGodkjenning?.tekniskeData ?? {};
    const structuredCarData = {
      plate: targetVehicle.kjoretoyId?.kjennemerke || 'Unknown',
      vin: targetVehicle.kjoretoyId?.understellsnummer || 'Unknown',
      brand: technicalData.generelt?.merke?.[0]?.merke || 'Unknown',
      model: technicalData.generelt?.handelsbetegnelse?.[0] || 'Unknown',
      color: technicalData.karosseriOgLasteplan?.rFarge?.[0]?.kodeNavn || '',
      tekniskedata: technicalData,
      registreringsdata: {
        forstegangsregistrering: targetVehicle.forstegangsregistrering ?? {},
        registrering: targetVehicle.registrering ?? {},
      },
      godkjenning: targetVehicle.godkjenning ?? {},
      cachedAt: new Date().toISOString()
    };

    // Committing the clean object directly into Cloud Firestore database cache
    await setDoc(carDocRef, structuredCarData);
    console.log(`Successfully cached vehicle metrics to Cloud Firestore for: ${input}`);

    return NextResponse.json({ source: 'api', data: structuredCarData });

  } catch (error: unknown) {
    console.error('API Pipeline Failure:', error);
    return NextResponse.json({ error: 'Internal Server Error Pipeline Collapse' }, { status: 500 });
  }
}

// Helper function to determine if the input is a license plate or VIN.  
// Note: With very old vehicles (<1985) the vin can be shorter and in some rare cases will not be able to be found with current logic
function checkInput(input: string): string {
  const inputType = ['kjennemerke', 'understellsnummer'];
  if (input.length > 7) return inputType[1]; // VIN check
  return inputType[0]; // License plate check
}

