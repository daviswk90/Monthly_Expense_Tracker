import "/src/styles.css"; 
import { Link } from "react-router-dom";
import {useSearchParams} from "react-router-dom";

export function HomePage() {
    const [params, setParms] = useSearchParams();
    const search = (params.get("search") || "").toLowerCase();
    const plans = [

    ]
}