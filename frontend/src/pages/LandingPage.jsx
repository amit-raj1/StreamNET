import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Video, 
  Users, 
  BookOpen, 
  Star, 
  Play, 
  Check, 
  ArrowRight,
  Globe,
  Award,
  Clock,
  UserPlus,
  UserMinus,
  Zap,
  Shield,
  Smartphone,
  Sparkles,
  Brain,
  Target,
  Heart,
  TrendingUp,
  Rocket
} from 'lucide-react';

const LearningPlatformLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "Smart Chat System",
      description: "AI-powered conversations with instant language translation and smart suggestions",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      bgColor: "from-cyan-500/10 to-indigo-600/10"
    },
    {
      icon: Video,
      title: "Immersive Video Hub",
      description: "4K video streaming with AR/VR integration and interactive whiteboards",
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      bgColor: "from-emerald-500/10 to-cyan-600/10"
    },
    {
      icon: Brain,
      title: "AI Learning Companion",
      description: "Personalized AI tutors that adapt to your learning style and pace",
      color: "from-violet-400 via-purple-500 to-fuchsia-600",
      bgColor: "from-violet-500/10 to-fuchsia-600/10"
    },
    {
      icon: Target,
      title: "Goal-Driven Learning",
      description: "Set targets, track progress, and celebrate achievements with gamified experiences",
      color: "from-orange-400 via-pink-500 to-rose-600",
      bgColor: "from-orange-500/10 to-rose-600/10"
    }
  ];

  const stats = [
    { number: "5M+", label: "Global Learners", icon: Users },
    { number: "100K+", label: "Expert Mentors", icon: Award },
    { number: "500K+", label: "Course Hours", icon: Clock },
    { number: "4.95★", label: "User Rating", icon: Star }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "ML Engineer",
      avatar: "AR",
      content: "The AI learning companion completely transformed how I understand complex algorithms. It's like having a personal genius tutor!",
      rating: 5,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Luna Zhang",
      role: "Product Designer",
      avatar: "LZ",
      content: "The collaborative features helped me build an incredible network. I've landed my dream job through connections made here!",
      rating: 5,
      gradient: "from-pink-500 to-rose-600"
    },
    {
      name: "Kai Johnson",
      role: "Data Scientist",
      avatar: "KJ",
      content: "Interactive video sessions with real-time code collaboration made learning data science incredibly engaging and fun.",
      rating: 5,
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>



      {/* Floating Navigation */}
      {/* <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-md rounded-full border border-white/10 px-8 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
              <BookOpen className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StreamNET</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-purple-400 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-pink-400 transition-colors">Pricing</a>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
              Sign Up
            </button>
          </div>
        </div>
      </nav> */}

      

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-10 ${isVisible.hero ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full px-6 py-3 border border-blue-500/20 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Next-Gen Learning Platform</span>
                  <Rocket className="w-5 h-5 text-pink-400" />
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Learn
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                    Beyond Limits
                  </span>
                </h1>
                
                <p className="text-2xl text-gray-300 leading-relaxed font-light">
                  Revolutionize your education with AI-powered learning, immersive experiences, 
                  and a global community of passionate learners.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 flex items-center justify-center space-x-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
                
                <button className="group border-2 border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Experience Demo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 mt-2 group-hover:text-white transition-colors">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative ${isVisible.hero ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="relative z-10">
                {/* Main Platform Mockup */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <div className="space-y-6">
                    {/* AI Chat Interface */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-blue-500/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                          AI
                        </div>
                        <div>
                          <div className="font-bold text-white">Learning Assistant</div>
                          <div className="text-xs text-emerald-400 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span>Ready to help</span>
                            <Brain className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-white/10 to-blue-500/10 rounded-xl p-4 text-sm font-medium">
                        "I've analyzed your learning pattern. Ready for an advanced React challenge? 🚀✨"
                      </div>
                    </div>

                    {/* Video Call Interface */}
                    <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl p-5 border border-purple-500/20 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Video className="w-5 h-5 text-purple-400" />
                          <span className="font-bold">Live Mentoring Session</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold">LIVE</span>
                        </div>
                      </div>
                      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                        <div className="text-center space-y-2">
                          <Users className="w-12 h-12 text-purple-400 mx-auto" />
                          <div className="text-sm font-semibold">3 participants</div>
                        </div>
                      </div>
                    </div>

                    {/* Social Features */}
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-xl p-4 border border-emerald-500/20 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-300 group">
                        <Heart className="w-6 h-6 text-emerald-400 group-hover:text-red-400 transition-colors" />
                        <span className="text-xs font-semibold">Connect</span>
                      </button>
                      <button className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-xl p-4 border border-orange-500/20 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-300 group">
                        <TrendingUp className="w-6 h-6 text-orange-400 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-xs font-semibold">Progress</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce-slow shadow-2xl">
                  <Award className="w-12 h-12 text-white" />
                </div>
                
                {/* Floating Notification */}
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl px-6 py-3 flex items-center space-x-3 animate-pulse shadow-2xl">
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">Goal Completed!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full px-6 py-3 border border-blue-500/20 backdrop-blur-sm mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Cutting-Edge Features</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Learning Experience
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Discover the future of education with AI-powered features that adapt to your unique learning style
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-3xl border cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    activeFeature === index
                      ? `bg-gradient-to-r ${feature.bgColor} border-blue-500/40 shadow-2xl shadow-blue-500/20`
                      : 'bg-black/20 border-white/10 hover:border-white/30 backdrop-blur-sm'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-xl`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-black/30 to-gray-900/50 rounded-4xl p-10 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className={`bg-gradient-to-r ${features[activeFeature].color} rounded-3xl p-10 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  {(() => {
                    const Icon = features[activeFeature].icon;
                    return <Icon className="w-20 h-20 text-white mx-auto mb-6 relative z-10" />;
                  })()}
                  <h3 className="text-3xl font-bold mb-4 text-white relative z-10">{features[activeFeature].title}</h3>
                  <p className="text-white/90 text-lg relative z-10">{features[activeFeature].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="bg-gradient-to-br from-black/20 to-gray-900/30 rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm group-hover:scale-105">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:text-purple-400 transition-colors" />
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 group-hover:text-white transition-colors font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Loved by
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Global Community
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-black/30 to-gray-900/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center space-x-1 mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg relative z-10">"{testimonial.content}"</p>
                  
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-4xl p-16 border border-blue-500/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
            
            <h2 className="text-5xl lg:text-7xl font-black mb-8 relative z-10">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Ready to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Transform Everything?
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed relative z-10">
              Join millions of learners who are already experiencing the future of education. Your journey starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <button className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 flex items-center justify-center space-x-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Start Free Today</span>
                <Rocket className="w-6 h-6 relative z-10 group-hover:translate-y-[-4px] transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
              
              <button className="border-2 border-white/20 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/5 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StreamNET</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Revolutionizing global education through AI-powered learning experiences and meaningful human connections.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            {[
              {
                title: "Platform",
                items: ["AI Features", "Live Sessions", "Mobile App", "API Access"]
              },
              {
                title: "Community",
                items: ["Global Network", "Study Groups", "Mentorship", "Events"]
              },
              {
                title: "Resources",
                items: ["Help Center", "Tutorials", "Blog", "Careers"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-xl mb-6 text-white">{section.title}</h4>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 StreamNET. Crafted with ❤️ for learners worldwide.</p>
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes animate-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: animate-gradient 3s ease infinite;
        }
        
        .rounded-4xl {
          border-radius: 2rem;
        }
        
        /* Glassmorphism effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        /* Hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\\:translate-x-2 {
          transform: translateX(0.5rem);
        }
        
        .group:hover .group-hover\\:translate-y-\\[-4px\\] {
          transform: translateY(-4px);
        }
        
        .group:hover .group-hover\\:text-red-400 {
          color: #f87171;
        }
        
        .group:hover .group-hover\\:text-yellow-400 {
          color: #facc15;
        }
        
        .group:hover .group-hover\\:text-purple-400 {
          color: #c084fc;
        }
        
        /* Enhanced animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Particle effect */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 50%;
          animation: particle-float 8s infinite linear;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Neon glow effects */
        .neon-glow {
          box-shadow: 
            0 0 5px #3b82f6,
            0 0 10px #3b82f6,
            0 0 15px #3b82f6,
            0 0 20px #3b82f6;
        }
        
        .neon-glow:hover {
          box-shadow: 
            0 0 10px #8b5cf6,
            0 0 20px #8b5cf6,
            0 0 30px #8b5cf6,
            0 0 40px #8b5cf6;
        }
        
        /* Text shimmer effect */
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        /* Advanced gradient animations */
        .gradient-shift {
          background: linear-gradient(
            45deg,
            #3b82f6,
            #8b5cf6,
            #ec4899,
            #f59e0b,
            #10b981,
            #3b82f6
          );
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Interactive hover states */
        .interactive-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .interactive-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }
        
        /* Smooth transitions for all elements */
        * {
          transition: color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }
        
        /* Mobile responsiveness improvements */
        @media (max-width: 768px) {
          .text-6xl { font-size: 3rem; }
          .text-7xl { font-size: 3.5rem; }
          .text-8xl { font-size: 4rem; }
        }
      `}</style>
    </div>
  );
};

export default LearningPlatformLanding;