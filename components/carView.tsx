import CarImage from "./carImage";
import { CarData } from "../utils/dataparser";

export default function CarView({ data }: { data: CarData | null }) {
  return (
    <div>
      {data && <div>
        <h2>{data.brand} {data.model}</h2>
        {data.plate}
        {data.color}
        
        </div>
        }
        {data && <CarImage 
          year={data.firstRegisteredNorway.substring(0, 4)} 
          brand={data.brand} 
          model={data.model} 
          />}
        
    </div>
  );
}