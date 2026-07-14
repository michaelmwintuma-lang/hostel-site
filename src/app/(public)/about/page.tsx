import { Target, Eye, Zap, User, Target as TargetIcon, Users, Heart, Globe, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-16">
      {/* Purpose & Direction Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 text-center max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a2530] dark:text-white tracking-tight mb-4">
          Purpose & Direction
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16">
          The driving force behind everything we do at Xtracity Hostel.
        </p>

        <div className="relative mx-auto max-w-5xl md:mb-12">
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E03B0D]/20 to-orange-400/20 blur-3xl -z-10 rounded-[3rem]" />
          
          <div className="grid md:grid-cols-12 gap-6 md:gap-0 items-center">
            {/* Mission Card - Spans 7 Columns */}
            <div className="md:col-span-7 bg-gradient-to-br from-[#E03B0D] to-[#b82f09] text-white p-10 md:p-14 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(224,59,13,0.3)] transition-all duration-500 z-0">
              {/* Decorative Elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/10">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold mb-5 tracking-tight">Our Mission</h3>
              <p className="text-white/90 leading-relaxed text-base font-medium relative z-10">
                Our mission is to provide students with a secure, comfortable, and vibrant home away from home. We are dedicated to delivering premium accommodation that seamlessly blends modern amenities with an environment conducive to academic excellence. We strive to take the stress out of everyday living so our residents can focus entirely on their studies, personal growth, and building lifelong friendships.
              </p>
            </div>

            {/* Vision Card - Spans 5 Columns, Overlaps Mission Card on Desktop */}
            <div className="md:col-span-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/50 dark:border-slate-700/50 md:-ml-8 lg:-ml-12 z-10 hover:-translate-y-2 transition-transform duration-500 group relative overflow-hidden">
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E03B0D]/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              
              <div className="bg-[#E03B0D]/10 dark:bg-[#E03B0D]/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-[#E03B0D]/10">
                <Eye className="w-7 h-7 text-[#E03B0D]" />
              </div>
              <h3 className="text-2xl font-extrabold mb-5 text-slate-900 dark:text-white tracking-tight">
                Our <span className="text-[#E03B0D]">Vision</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium relative z-10">
                Our vision is to be the premier choice for student housing, recognized for setting the highest standards in safety, comfort, and community support. We aim to cultivate an inclusive, thriving environment where young scholars are empowered to achieve their academic goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-[#1a2530] text-slate-50 py-20 mt-10 flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-16 max-w-2xl text-left">
            <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">Our Core Values</h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-lg">
              At Xtracity Hostel, our core values drive quality impact, innovation, and community trust in every initiative we undertake.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Value 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">01</span>
                <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Academic Excellence</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We provide a quiet, resource-rich environment that empowers students to focus and achieve their highest potential.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">02</span>
                <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Personal Growth</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We support the transition to independent living, helping students develop essential life skills and self-reliance.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">03</span>
                <TargetIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Holistic Well-being</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We prioritize the mental and physical health of our residents by maintaining safe, stress-free living spaces.
                </p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">04</span>
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Community & Networking</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We foster a vibrant, inclusive family where students build lifelong friendships and meaningful connections.
                </p>
              </div>
            </div>

            {/* Value 5 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">05</span>
                <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Diversity & Inclusion</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We celebrate a rich tapestry of backgrounds, creating a welcoming home where every student feels respected.
                </p>
              </div>
            </div>

            {/* Value 6 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">06</span>
                <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Sustainability & Care</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We uphold eco-friendly practices and maintain pristine facilities to ensure a healthy living environment.
                </p>
              </div>
            </div>

            {/* Value 7 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">07</span>
                <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Uncompromising Safety</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We uphold the strictest security measures, ensuring parents have peace of mind and students feel completely safe.
                </p>
              </div>
            </div>

            {/* Value 8 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg flex items-start space-x-6 border dark:border-slate-800">
              <div className="flex flex-col space-y-1">
                <span className="text-[#E03B0D] font-bold text-lg">08</span>
                <Sparkles className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[#1a2530] dark:text-white">Modern Convenience</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We continuously upgrade our amenities to seamlessly support the fast-paced, modern student lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
