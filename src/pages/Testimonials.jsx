import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    { name: "Sarah Jenkins", role: "Homeowner", text: "NCC Tiles transformed our kitchen completely! The quality of the tiles is exactly what we were looking for and the installation was flawless.", rating: 5 },
    { name: "David Mokoena", role: "Property Developer", text: "As a developer, I need reliable suppliers. NCC has consistently delivered premium tiles on time and within budget for all my projects.", rating: 5 },
    { name: "Michelle van der Merwe", role: "Interior Designer", text: "Their range of modern tiles is unmatched. I always bring my clients here first as I know they'll find something unique and high-quality.", rating: 5 },
    { name: "Sipho Ndlovu", role: "Restaurant Owner", text: "The commercial grade tiles we installed in our busy restaurant look as good as new after two years. Very impressed with the durability.", rating: 5 },
    { name: "Jessica Smith", role: "Architect", text: "Precision and consistency are key for my firm's projects. NCC Tiles guarantees both, alongside phenomenal customer support whenever we need custom sizes.", rating: 5 },
    { name: "Ahmed Patel", role: "Homeowner", text: "From the showroom visit to the final delivery, absolutely professional. The pricing is very competitive for this grade of ceramic tile.", rating: 5 },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary mb-6">What Our Customers Say</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">Don't just take our word for it. Here's what our satisfied customers have to say about their NCC Tiles experience over the years.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
             <div key={idx} className="bg-gray-50 border border-gray-100 p-8 rounded-3xl relative hover:shadow-lg transition-shadow">
                <Quote className="absolute top-6 right-8 text-blue-100 w-16 h-16 rotate-180 -z-0" />
                <div className="relative z-10">
                   <div className="flex gap-1 text-yellow-400 mb-6">
                      {[...Array(test.rating)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                   </div>
                   <p className="text-lg text-gray-700 italic mb-8 leading-relaxed">"{test.text}"</p>
                   <div className="flex items-center gap-4 mt-auto">
                      <div className="w-14 h-14 bg-blue-100 text-primary flex items-center justify-center rounded-full font-bold text-xl">
                         {test.name.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-bold text-secondary text-lg">{test.name}</h4>
                         <p className="text-gray-500 text-sm">{test.role}</p>
                      </div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
