import { Fragment, useRef, useState } from "react";
import type { CarData, VehicleJsonObject, VehicleJsonValue } from "../utils/dataparser";

interface VehicleDetailsProps {
  cars: { id: string; data: CarData }[];
}

interface DetailSection {
  title: string;
  matches: (path: string) => boolean;
}

const registrationPrefix = "registreringsdata.registrering.";
const initialApprovalPrefix = "godkjenning.forstegangsGodkjenning.";
const technicalApprovalPrefix = "godkjenning.tekniskGodkjenning.";
const technicalDataPaths = ["tekniskedata."];
const fieldColumnWidth = 256;
const carColumnWidth = 208;

const detailSections: DetailSection[] = [
  {
    title: "1. Rot & Identifikasjon",
    matches: (path) =>
      ["plate", "vin", "brand", "model", "color"].includes(path) ||
      path.includes(".kjoretoyId."),
  },
  {
    title: "2. Registreringsstatus & Tidspunkter",
    matches: (path) =>
      path.startsWith("registreringsdata.forstegangsregistrering.") ||
      [
        "fomTidspunkt",
        "registrertForstegangPaEierskap",
        "tilTidspunkt",
        "avregistrertSidenDato",
        "neringskode",
        "neringskodeBeskrivelse",
      ].some((field) => path === `${registrationPrefix}${field}`),
  },
  {
    title: "3. Aktivt Kjennemerke (Skilt)",
    matches: (path) => path.startsWith("kjennemerke[") || path.includes(".kjennemerke["),
  },
  {
    title: "4. Kjøringens Art & Koder",
    matches: (path) =>
      path.startsWith(`${registrationPrefix}kjoringensArt.`) ||
      path.startsWith(`${registrationPrefix}registreringsstatus.`) ||
      path.startsWith(`${registrationPrefix}vektarsavgiftOppgittGrunnlag.`),
  },
  {
    title: "5. Førstegangs Godkjenning",
    matches: (path) =>
      path.startsWith(initialApprovalPrefix) &&
      ![
        "bruktimport.",
        "fortollingOgMva.",
        "oppbygdMedAvgiftsfritak.",
        "unntak[",
      ].some((nestedPath) => path.slice(initialApprovalPrefix.length).startsWith(nestedPath)),
  },
  {
    title: "6. Bruktimport, Toll & Avgiftsfritak",
    matches: (path) =>
      ["bruktimport.", "fortollingOgMva.", "oppbygdMedAvgiftsfritak.", "unntak["]
        .some((nestedPath) => path.slice(initialApprovalPrefix.length).startsWith(nestedPath)) &&
      path.startsWith(initialApprovalPrefix),
  },
  {
    title: "7. Merknader & Begrensninger",
    matches: (path) =>
      path.startsWith("godkjenning.kjoretoymerknad[") ||
      path.startsWith("godkjenning.registreringsbegrensninger."),
  },
  {
    title: "8. Teknisk Godkjenning & Klassifisering",
    matches: (path) =>
      path.startsWith(technicalApprovalPrefix) &&
      ![
        "kjoretoyklassifisering.",
        "korreksjon.",
        "krav[",
        "tekniskeData.",
      ].some((nestedPath) => path.slice(technicalApprovalPrefix.length).startsWith(nestedPath)),
  },
  {
    title: "9. Typegodkjenning (EF / Nasjonal)",
    matches: (path) => path.startsWith(`${technicalApprovalPrefix}kjoretoyklassifisering.`),
  },
  {
    title: "10. Korreksjoner & Kravområder",
    matches: (path) =>
      path.startsWith(`${technicalApprovalPrefix}korreksjon.`) ||
      path.startsWith(`${technicalApprovalPrefix}krav[`),
  },
  {
    title: "11. Tekniske Data (Akslinger)",
    matches: (path) => technicalDataPaths.some((prefix) => path.startsWith(`${prefix}akslinger.`)),
  },
  {
    title: "Øvrige tekniske data",
    matches: (path) => technicalDataPaths.some((prefix) => path.startsWith(prefix)),
  },
  {
    title: "Øvrige kjøretøydata",
    matches: () => true,
  },
];

function flattenValue(
  value: VehicleJsonValue | undefined,
  path: string,
  result: Map<string, string>,
) {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenValue(item, `${path}[${index}]`, result));
    return;
  }

  if (typeof value === "object") {
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .forEach(([key, nestedValue]) => {
        flattenValue(nestedValue, path ? `${path}.${key}` : key, result);
      });
    return;
  }

  result.set(path, String(value));
}

function flattenCarData(data: CarData) {
  const values = new Map<string, string>();
  const approvalData = data.godkjenning.tekniskGodkjenning
    ? {
        ...data.godkjenning,
        tekniskGodkjenning: {
          ...data.godkjenning.tekniskGodkjenning,
          tekniskeData: undefined,
        },
      }
    : data.godkjenning;
  const comparableData: VehicleJsonObject = {
    plate: data.plate,
    vin: data.vin,
    brand: data.brand,
    model: data.model,
    color: data.color,
    tekniskedata: data.tekniskedata,
    registreringsdata: data.registreringsdata,
    godkjenning: approvalData,
  };

  flattenValue(comparableData, "", values);
  return values;
}

function displayValue(value: string | undefined) {
  return value === undefined || value.trim() === "" ? "-" : value;
}

export default function VehicleDetails({ cars }: VehicleDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set());
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  if (cars.length === 0) return null;

  const valuesByCar = cars.map((car) => flattenCarData(car.data));
  const paths = Array.from(new Set(valuesByCar.flatMap((values) => Array.from(values.keys())))).sort();
  const pathsBySection = detailSections.map(() => [] as string[]);
  const tableMinWidth = fieldColumnWidth + cars.length * carColumnWidth;

  paths.forEach((path) => {
    const sectionIndex = detailSections.findIndex((section) => section.matches(path));
    pathsBySection[sectionIndex === -1 ? pathsBySection.length - 1 : sectionIndex].push(path);
  });

  return (
    <details className="mt-6 w-full border-y border-zinc-300">
      <summary className="cursor-pointer py-3 text-sm font-semibold text-zinc-800">
        Compare detailed data
        <span className="ml-2 font-normal text-zinc-500">{paths.length} fields</span>
      </summary>
      <div className="pb-4">
        <div className="sticky top-0 z-30 border-b border-zinc-300 bg-white shadow-sm">
          <div
            className="overflow-x-auto"
            onScroll={(event) => {
              const tableScroll = tableScrollRef.current;
              if (tableScroll && tableScroll.scrollLeft !== event.currentTarget.scrollLeft) {
                tableScroll.scrollLeft = event.currentTarget.scrollLeft;
              }
            }}
            ref={headerScrollRef}
          >
            <table
              aria-hidden="true"
              className="w-full table-fixed border-collapse text-left text-sm"
              style={{ minWidth: `${tableMinWidth}px` }}
            >
              <colgroup>
                <col style={{ width: `${fieldColumnWidth}px` }} />
                {cars.map((car) => (
                  <col key={car.id} style={{ width: `${carColumnWidth}px` }} />
                ))}
              </colgroup>
              <thead>
                <tr className="h-10">
                  <th className="h-10 truncate px-3 py-2 font-semibold" scope="col">
                    Field
                  </th>
                  {cars.map((car, index) => (
                    <th className="h-10 truncate px-3 py-2 font-semibold" key={car.id} scope="col" title={car.data.plate}>
                      {car.data.plate || `Car ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div
          className="overflow-x-auto"
          onScroll={(event) => {
            const headerScroll = headerScrollRef.current;
            if (headerScroll && headerScroll.scrollLeft !== event.currentTarget.scrollLeft) {
              headerScroll.scrollLeft = event.currentTarget.scrollLeft;
            }
          }}
          ref={tableScrollRef}
        >
          <table
            className="w-full table-fixed border-collapse text-left text-sm"
            style={{ minWidth: `${tableMinWidth}px` }}
          >
            <colgroup>
              <col style={{ width: `${fieldColumnWidth}px` }} />
              {cars.map((car) => (
                <col key={car.id} style={{ width: `${carColumnWidth}px` }} />
              ))}
            </colgroup>
            <thead className="sr-only">
              <tr>
                <th scope="col">
                  Field
                </th>
                {cars.map((car, index) => (
                  <th key={car.id} scope="col">
                    {car.data.plate || `Car ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailSections.map((section, sectionIndex) => {
                const sectionPaths = pathsBySection[sectionIndex];
                const isExpanded = expandedSections.has(section.title);

                return (
                  <Fragment key={section.title}>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="p-0 text-left" colSpan={cars.length + 1} scope="rowgroup">
                        <button
                          aria-expanded={isExpanded}
                          className="flex h-10 w-full items-center gap-2 px-3 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                          onClick={() => {
                            setExpandedSections((current) => {
                              const next = new Set(current);
                              if (isExpanded) next.delete(section.title);
                              else next.add(section.title);
                              return next;
                            });
                          }}
                          type="button"
                        >
                          <span aria-hidden="true" className="w-4 text-center">
                            {isExpanded ? "−" : "+"}
                          </span>
                          {section.title}
                          <span className="font-normal text-zinc-500">{sectionPaths.length} fields</span>
                        </button>
                      </th>
                    </tr>
                    {isExpanded && sectionPaths.length === 0 && (
                      <tr className="border-b border-zinc-100">
                        <td className="h-10 px-3 text-sm text-zinc-500" colSpan={cars.length + 1}>
                          No data available.
                        </td>
                      </tr>
                    )}
                    {isExpanded && sectionPaths.map((path) => (
                      <tr className="h-10 border-b border-zinc-100" key={path}>
                        <th className="sticky left-0 h-10 bg-white px-3 py-2 text-left font-medium text-zinc-700" scope="row" title={path}>
                          <span className="block truncate">{path}</span>
                        </th>
                        {valuesByCar.map((values, index) => (
                          <td className="h-10 truncate px-3 py-2 text-zinc-600" key={cars[index].id} title={displayValue(values.get(path))}>
                            {displayValue(values.get(path))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}