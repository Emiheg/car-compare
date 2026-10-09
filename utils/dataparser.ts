export type VehicleJsonValue =
  | string
  | number
  | boolean
  | null
  | VehicleJsonValue[]
  | VehicleJsonObject;

export interface VehicleJsonObject {
  [key: string]: VehicleJsonValue | undefined;
}

export interface VehicleCodeValue extends VehicleJsonObject {
  kodeBeskrivelse?: string;
  kodeNavn?: string;
  kodeTypeId?: string;
  kodeVerdi?: string;
  tidligereKodeVerdi?: string[];
}

export interface VehicleTechnicalData extends VehicleJsonObject {
  akslinger?: VehicleJsonObject & {
    akselGruppe?: VehicleJsonObject[];
    antallAksler?: number;
    forbindelseMellomDrivaksler?: VehicleCodeValue;
  };
  bremser?: VehicleJsonObject;
  dekkOgFelg?: VehicleJsonObject;
  dimensjoner?: VehicleJsonObject & {
    bredde?: number;
    hoyde?: number;
    lengde?: number;
  };
  generelt?: VehicleJsonObject & {
    fabrikant?: VehicleJsonObject[];
    handelsbetegnelse?: string[];
    merke?: (VehicleJsonObject & { merke?: string; merkeKode?: string })[];
    typebetegnelse?: string;
  };
  karosseriOgLasteplan?: VehicleJsonObject & {
    karosseritype?: VehicleCodeValue;
    rFarge?: VehicleCodeValue[];
  };
  miljodata?: VehicleJsonObject;
  motorOgDrivverk?: VehicleJsonObject;
  ovrigeTekniskeData?: VehicleJsonObject[];
  persontall?: VehicleJsonObject;
  tilhengerkopling?: VehicleJsonObject;
  vekter?: VehicleJsonObject;
}

export interface VehicleRegistrationData extends VehicleJsonObject {
  forstegangsregistrering: VehicleJsonObject & {
    registrertForstegangNorgeDato?: string;
  };
  registrering: VehicleJsonObject & {
    avregistrertSidenDato?: string;
    fomTidspunkt?: string;
    kjoringensArt?: VehicleCodeValue;
    neringskode?: string;
    neringskodeBeskrivelse?: string;
    registreringsstatus?: VehicleCodeValue;
    registrertForstegangPaEierskap?: string;
    tilTidspunkt?: string;
    vektarsavgiftOppgittGrunnlag?: VehicleJsonObject;
  };
}

export interface VehicleApprovalData extends VehicleJsonObject {
  forstegangsGodkjenning?: VehicleJsonObject & {
    bruktimport?: VehicleJsonObject & {
      importland?: VehicleJsonObject & { landNavn?: string; landkode?: string };
      kilometerstand?: number;
      tidligereUtenlandskKjennemerke?: string;
      tidligereUtenlandskVognkortNummer?: string;
    };
    forstegangRegistrertDato?: string;
    fortollingOgMva?: VehicleJsonObject;
    godkjenningsId?: string;
    godkjenningsundertype?: VehicleCodeValue;
    gyldigFraDato?: string;
    gyldigFraDatoTid?: string;
    kvalitetskodeForstegangRegDato?: VehicleCodeValue;
    oppbygdMedAvgiftsfritak?: VehicleJsonObject;
    unntak?: VehicleJsonObject[];
  };
  kjoretoymerknad?: VehicleJsonObject[];
  registreringsbegrensninger?: VehicleJsonObject & {
    registreringsbegrensning?: VehicleCodeValue[];
  };
  tekniskGodkjenning?: VehicleJsonObject & {
    godkjenningsId?: string;
    godkjenningsundertype?: VehicleCodeValue;
    gyldigFraDato?: string;
    gyldigFraDatoTid?: string;
    kjoretoyklassifisering?: VehicleJsonObject;
    korreksjon?: VehicleJsonObject;
    krav?: VehicleJsonObject[];
    tekniskeData?: VehicleTechnicalData;
    unntak?: VehicleJsonObject[];
  };
  tilleggsgodkjenninger?: VehicleJsonObject[];
}

export interface CarData {
  plate: string;
  vin: string;
  brand: string;
  model: string;
  color: string;
  tekniskedata: VehicleTechnicalData;
  registreringsdata: VehicleRegistrationData;
  godkjenning: VehicleApprovalData;
  cachedAt: string;
}
