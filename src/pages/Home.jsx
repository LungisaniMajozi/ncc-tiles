import React, { useState } from "react";
import Hero from "../components/Hero";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Truck, ShieldCheck, ThumbsUp, Medal, Quote } from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("All Projects");
  const navigate = useNavigate();

  const portfolio = [
    { id: 1, title: "Modern Kitchen Backsplash", cat: "Kitchens", loc: "Sandton", img: "https://images.unsplash.com/photo-1556910103-1c02745a828b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Luxury Bathroom Suite", cat: "Bathrooms", loc: "Hyde Park", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Feature Wall Statement", cat: "Living Rooms", loc: "Rosebank", img: "https://images.unsplash.com/photo-1600607686527-6f6a5b6c59b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Boutique Hotel Lobby", cat: "Commercial Spaces", loc: "Umhlanga", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 5, title: "Contemporary Chef Kitchen", cat: "Kitchens", loc: "Constantia", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "Spa-Inspired Retreat", cat: "Bathrooms", loc: "Clifton", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ];

  const features = [
    { icon: <Medal size={36}/>, title: "10+ Years Experience", text: "Proven expertise in ceramic tiles and custom installations for residential and commercial spaces." },
    { icon: <Star size={36} />, title: "Modern Designs", text: "Stay ahead of trends with our contemporary, handpicked tile selections." },
    { icon: <Clock size={36} />, title: "Fast Turnaround", text: "Quick delivery on standard items and efficient custom order processing." },
    { icon: <ThumbsUp size={36} />, title: "Expert Installation", text: "Professional installation services with trained, seasoned craftsmen." },
    { icon: <ShieldCheck size={36} />, title: "Quality Guarantee", text: "SABS approved products with comprehensive long-lasting warranties." },
    { icon: <Truck size={36} />, title: "Free Delivery", text: "Complimentary delivery service on orders over R1000 across Johannesburg." },
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Homeowner", text: "NCC Tiles transformed our kitchen completely! The quality of the tiles is exactly what we were looking for and the installation was flawless.", rating: 5 },
    { name: "David Mokoena", role: "Property Developer", text: "As a developer, I need reliable suppliers. NCC has consistently delivered premium tiles on time and within budget for all my projects.", rating: 5 },
    { name: "Michelle van der Merwe", role: "Interior Designer", text: "Their range of modern tiles is unmatched. I always bring my clients here first as I know they'll find something unique and high-quality.", rating: 5 },
    { name: "Sipho Ndlovu", role: "Restaurant Owner", text: "The commercial grade tiles we installed in our busy restaurant look as good as new after two years. Very impressed with the durability.", rating: 5 },
  ];

  const displayedPortfolio = activeTab === "All Projects" ? portfolio : portfolio.filter(p => p.cat === activeTab);

  return (
    <>
      <Hero />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">Why Choose NCC Tiles?</h2>
            <p className="text-gray-600 text-lg">We're committed to delivering exceptional quality, outstanding service, and innovative design solutions for your home improvement needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
                <div className="text-primary mb-6 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feat.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
             <button onClick={() => navigate("/products")} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition">
               Get Your Free Quote Today
             </button>
          </div>
        </div>
      </section>



    </>
  );
};

export default Home;
