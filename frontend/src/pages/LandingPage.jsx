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
  Smartphone
} from 'lucide-react';

const LearningPlatformLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});

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

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Connect instantly with learners worldwide through our advanced messaging system",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Video,
      title: "HD Video Calls",
      description: "Crystal clear video communication for immersive learning experiences",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Social Learning",
      description: "Build your network, make friends, and learn together in a supportive community",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description: "Engage with dynamic content designed by world-class educators",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "2M+", label: "Active Learners" },
    { number: "50K+", label: "Expert Instructors" },
    { number: "100K+", label: "Course Hours" },
    { number: "4.9★", label: "Platform Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      avatar: "SC",
      content: "The video calling feature made learning programming so much easier. I could get instant help from mentors!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Data Scientist",
      avatar: "MJ",
      content: "Building connections with fellow learners transformed my educational journey. The social features are incredible.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "UX Designer",
      avatar: "PP",
      content: "The chat system is so intuitive. I've made lifelong friends and learning partners through this platform.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible.hero ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full px-4 py-2 border border-blue-500/30">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">StreamNET Learning Platform</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Learn, Connect,
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}Grow
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join millions of learners in an immersive educational experience. Chat with peers, 
                  video call with mentors, and build lasting friendships while mastering new skills.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group border-2 border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative ${isVisible.hero ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="relative z-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="space-y-6">
                  {/* Mock Chat Interface */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                        JD
                      </div>
                      <div>
                        <div className="font-semibold">Amit Raj</div>
                        <div className="text-xs text-gray-400 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Online now</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                      "Hey! Ready for our JavaScript study session? 🚀"
                    </div>
                  </div>

                  {/* Mock Video Call */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">AI Tutor Session</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">Live</span>
                      </div>
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                      <Video className="w-12 h-12 text-purple-400" />
                    </div>
                  </div>

                  {/* Social Features */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl p-3 border border-green-500/30 flex items-center space-x-2 hover:scale-105 transition-transform">
                      <UserPlus className="w-5 h-5 text-green-400" />
                      <span className="text-sm">Add Friend</span>
                    </button>
                    <button className="bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl p-3 border border-orange-500/30 flex items-center space-x-2 hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 text-orange-400" />
                      <span className="text-sm">Join Group</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Modern Learning</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience education like never before with our cutting-edge platform designed for the digital age
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className={`bg-gradient-to-r ${features[activeFeature].color} rounded-2xl p-8 text-center`}>
                  {(() => {
                    const Icon = features[activeFeature].icon;
                    return <Icon className="w-16 h-16 text-white mx-auto mb-4" />;
                  })()}
                  <h3 className="text-2xl font-bold mb-2 text-white">{features[activeFeature].title}</h3>
                  <p className="text-white/90">{features[activeFeature].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Loved by
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Learners Worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Learning Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join millions of learners who have already discovered the power of social learning. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">StreamNET</span>
              </div>
              <p className="text-gray-400">Connecting learners worldwide through innovative educational technology.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Mobile App</div>
                <div>Integration</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Community</div>
                <div>Contact Us</div>
                <div>Status</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Privacy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StreamNET. All rights reserved.</p>
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LearningPlatformLanding;