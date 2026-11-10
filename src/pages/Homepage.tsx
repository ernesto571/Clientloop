import Compare from "../components/Home/Compare";
import Hero from "../components/Home/Hero";
import Pricing from "../components/Home/Pricing";
import Product from "../components/Home/Product";


export default function HomePage (){

    return (
        <main>
            <Hero />
            <Product />
            <Compare />
            <Pricing />
        </main>
    )
}