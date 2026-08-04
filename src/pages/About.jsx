import { Medal, ShieldCheck, Heart, Target, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
       {/* Hero Section */}
       <div 
         className="relative bg-secondary text-white py-40 bg-fixed bg-center bg-cover"
         style={{ backgroundImage: "url('/images/about_bg.png')" }}
       >
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/10 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
             <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-4 block">Welcome to Our World</span>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg tracking-tight">About NCC Tiles</h1>
             <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
               Naeve Construction Company (NCC) strives to redefine spaces across South Africa. With over a decade of excellence, we bring you unmatched quality in ceramic and porcelain tiles alongside premier installation expertise.
             </p>
          </div>
       </div>

       {/* Values Section */}
       <div className="max-w-7xl mx-auto px-4 py-20 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 text-center border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                   <Medal size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">10+ Years Heritage</h3>
                <p className="text-gray-600 leading-relaxed">Established over ten years ago, NCC has built a strong reputation across the construction industry for reliability, scale, and high-end aesthetics.</p>
             </div>
             
             <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 text-center border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                   <ShieldCheck size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Uncompromising Quality</h3>
                <p className="text-gray-600 leading-relaxed">Every single tile sourced meets strict SABS approval. We believe your walls and floors should outlast trends with unwavering structural integrity.</p>
             </div>

             <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 text-center border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                   <Heart size={36} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Customer First</h3>
                <p className="text-gray-600 leading-relaxed">From commercial contracting to individual home renovations, our consultants handle every client with explicit priority and dedicated design support.</p>
             </div>
          </div>
       </div>

       {/* Our Story Section */}
       <div className="bg-white py-24 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative">
                 <img src="/images/about_story.jpg" alt="NCC Tiles Showroom" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} />
                 <div className="absolute inset-0 bg-gradient-to-tr from-secondary/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                 <p className="text-4xl font-bold text-primary mb-1">10K+</p>
                 <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Projects Completed</p>
              </div>
            </div>
            <div>
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Our Story</span>
              <h2 className="text-4xl font-bold text-secondary mb-6">Building Foundations That Last Generations</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                 <p>
                    What started as a modest supplier operation a decade ago has evolved into one of South Africa's premier providers of premium ceramic and porcelain tiles. NCC Tiles was founded on a simple premise: high-quality building materials shouldn't be a luxury reserved for a few.
                 </p>
                 <p>
                    Over the years, we've carefully curated relationships with top-tier international manufacturers and local craftspeople. This unique blend allows us to offer an expansive portfolio ranging from rugged outdoor slip-resistant stones to the most elegant, mirror-finish indoor porcelains.
                 </p>
                 <p>
                    Today, Naeve Construction Company isn't just about selling tiles. We are about delivering a full-scale vision. With a dedicated in-house team of design consultants and professional installers, we ensure that the journey from selecting a tile to placing the final grout line is seamless, stress-free, and spectacular.
                 </p>
              </div>
            </div>
         </div>
       </div>

       {/* Mission & Vision */}
       <div className="max-w-7xl mx-auto px-4 py-24">
         <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-secondary to-slate-800 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Target size={120} />
               </div>
               <div className="bg-white/10 w-16 h-16 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <Target size={32} className="text-blue-300" />
               </div>
               <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
               <p className="text-gray-300 text-lg leading-relaxed mb-6">
                 To empower homeowners, architects, and builders with world-class tiling solutions. We strive to provide unparalleled customer service, ensuring every project, regardless of size, achieves its maximum aesthetic and structural potential.
               </p>
            </div>

            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Eye size={120} />
               </div>
               <div className="bg-white/10 w-16 h-16 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <Eye size={32} className="text-blue-200" />
               </div>
               <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
               <p className="text-blue-100 text-lg leading-relaxed mb-6">
                 To be the undisputed leader in the South African construction and design space, known universally for our innovative product lines, sustainable practices, and ability to turn ordinary spaces into extraordinary masterpieces.
               </p>
            </div>
         </div>
       </div>

       {/* Why Choose Us */}
       <div className="bg-gray-100 py-24">
          <div className="max-w-7xl mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">The NCC Difference</span>
                <h2 className="text-4xl font-bold text-secondary mb-6">Why Choose NCC Tiles?</h2>
                <p className="text-xl text-gray-600">We go beyond just supplying materials. We partner with you to bring your architectural dreams to life.</p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Vast Selection", desc: "Hundreds of styles, finishes, and sizes in stock to match any specific design requirement." },
                  { title: "Expert Advice", desc: "Our staff includes experienced interior designers ready to help you coordinate colors and patterns." },
                  { title: "Nationwide Delivery", desc: "Safe, prompt, and reliable logistics ensuring your fragile materials arrive in pristine condition." },
                  { title: "Guaranteed Quality", desc: "Rigorous quality control and SABS approved products to ensure maximum durability." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/50 transition-colors">
                     <CheckCircle className="text-accent mb-4" size={28} />
                     <h4 className="text-xl font-bold text-secondary mb-3">{item.title}</h4>
                     <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* CTA Section */}
       <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="bg-gradient-to-r from-secondary to-primary rounded-3xl p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 mix-blend-overlay"></div>
             <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Space?</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                  Browse our extensive collection of premium tiles or get in touch with our expert team for a personalized design consultation today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <Link to="/products" className="bg-white text-secondary font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-50 hover:-translate-y-1 transition-all flex items-center justify-center">
                     Explore Collection <ArrowRight size={20} className="ml-2" />
                   </Link>
                   <Link to="/contact" className="bg-accent text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all border border-transparent">
                     Contact Us
                   </Link>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default About;
