import { Medal, ShieldCheck, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
       {/* Hero Section */}
       <div 
         className="relative bg-secondary text-white py-32 bg-fixed bg-center bg-cover"
         style={{ backgroundImage: "url('/images/about_bg.png')" }}
       >
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
             <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">About NCC Tiles</h1>
             <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
               Naeve Construction Company (NCC) strives to redefine spaces across South Africa. With over a decade of excellence, we bring you unmatched quality in ceramic and porcelain tiles alongside premier installation expertise.
             </p>
          </div>
       </div>

       {/* Values Section */}
       <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="bg-white p-10 rounded-2xl shadow-sm text-center border top-border hover:-translate-y-2 transition-transform">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                   <Medal size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">10+ Years Heritage</h3>
                <p className="text-gray-600">Established over ten years ago, NCC has built a strong reputation across the construction industry for reliability, scale, and high-end aesthetics.</p>
             </div>
             
             <div className="bg-white p-10 rounded-2xl shadow-sm text-center border top-border hover:-translate-y-2 transition-transform">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                   <ShieldCheck size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Uncompromising Quality</h3>
                <p className="text-gray-600">Every single tile sourced meets strict SABS approval. We believe your walls and floors should outlast trends with unwavering structural integrity.</p>
             </div>

             <div className="bg-white p-10 rounded-2xl shadow-sm text-center border top-border hover:-translate-y-2 transition-transform">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                   <Heart size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Customer First</h3>
                <p className="text-gray-600">From commercial contracting to individual home renovations, our consultants handle every client with explicit priority and dedicated design support.</p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default About;
