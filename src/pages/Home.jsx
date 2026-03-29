import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { products, categories } = useProducts();
  const featured = products.filter((p) => p.inStock).slice(0, 4);

  return (
    <>
      <Hero />

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="p-6 bg-gray-50 rounded-xl text-center hover:bg-primary hover:text-white transition group"
              >
                <h3 className="font-semibold">{cat}</h3>
                <ArrowRight
                  className="mx-auto mt-2 opacity-0 group-hover:opacity-100 transition"
                  size={16}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-secondary">
              Featured Tiles
            </h2>
            <Link
              to="/products"
              className="text-primary font-medium hover:underline flex items-center"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
