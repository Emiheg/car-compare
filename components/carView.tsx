import CarImage from "./carImage";
import { CarData } from "../utils/dataparser";

export default function CarView({ data }: { data: CarData | null }) {
  const registrationDate = data?.registreringsdata.forstegangsregistrering.registrertForstegangNorgeDato;
  const year = typeof registrationDate === "string" ? registrationDate.substring(0, 4) : "Unknown";

  return (
    <div>
      {data && <div>
        <h2>{data.brand} {data.model}</h2>
        {data.plate}
        
        </div>
        }
        {data && <CarImage 
          year={year} 
          brand={data.brand} 
          model={data.model} 
          />}
        
    </div>
  );
}