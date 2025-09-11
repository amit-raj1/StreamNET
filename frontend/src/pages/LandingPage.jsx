import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { 
  Video, 
  MessageCircle, 
  Users, 
  UserPlus, 
  LogIn, 
  Shield, 
  Zap, 
  Globe, 
  Smartphone,
  Heart,
  Settings,
  Sparkles
} from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';

const LandingPage = () => {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100 text-base-content" data-theme={theme}>
      {/* Dynamic Background Effects - Theme Aware */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="navbar bg-base-200/70 backdrop-blur-md border-b border-base-300 px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Video className="w-8 h-8" />
              StreamNET
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Content */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                  Connect. Stream. Chat.
                </h1>
                
                <p className="text-lg lg:text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                  Experience the future of communication with StreamNET. Connect with friends worldwide through 
                  crystal-clear video calls and seamless real-time chat, all in one beautiful platform.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-16">
                <div className="card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="card-body text-center p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="card-title text-xl justify-center mb-3">HD Video Calls</h3>
                    <p className="text-base-content/70">
                      Crystal-clear video calls with adaptive quality that works seamlessly across all devices and connections.
                    </p>
                  </div>
                </div>
                
                <div className="card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="card-body text-center p-8">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="card-title text-xl justify-center mb-3">Real-time Chat</h3>
                    <p className="text-base-content/70">
                      Lightning-fast messaging with read receipts, typing indicators, and rich media support for dynamic conversations.
                    </p>
                  </div>
                </div>
                
                <div className="card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="card-body text-center p-8">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="card-title text-xl justify-center mb-3">Connect Globally</h3>
                    <p className="text-base-content/70">
                      Build meaningful connections worldwide with our smart friend discovery system and community features.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-16 space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-base-content">
                    Ready to transform your communication experience?
                  </h2>
                  <p className="text-base-content/70 max-w-2xl mx-auto">
                    Join thousands of users already enjoying seamless connections on StreamNET.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    to="/signup"
                    className="btn btn-primary btn-lg px-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <UserPlus className="w-5 h-5" />
                    Get Started Free
                  </Link>
                  <Link 
                    to="/login"
                    className="btn btn-outline btn-lg px-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </div>
                
                <p className="text-sm text-base-content/60 mt-8">
                  No credit card required • Free forever plan available • Join in 30 seconds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-base-200/30">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content mb-6">
                Why Choose StreamNET?
              </h2>
              <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
                Built for the modern world with cutting-edge technology and user-first design principles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">End-to-End Security</h3>
                    <p className="text-base-content/70">
                      Your conversations are protected with military-grade encryption, ensuring complete privacy and security.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">Lightning Fast</h3>
                    <p className="text-base-content/70">
                      Optimized for speed with instant message delivery and ultra-low latency video calls.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">Global Reach</h3>
                    <p className="text-base-content/70">
                      Connect with anyone, anywhere in the world with our robust global infrastructure.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">Cross-Platform</h3>
                    <p className="text-base-content/70">
                      Seamlessly sync across all your devices - mobile, tablet, desktop, and web browsers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">User-Friendly</h3>
                    <p className="text-base-content/70">
                      Intuitive design that anyone can master in minutes, with powerful features for advanced users.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">Highly Customizable</h3>
                    <p className="text-base-content/70">
                      Personalize your experience with themes, notification settings, and privacy controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto text-center px-4 lg:px-8">
            <div className="card bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-base-300">
              <div className="card-body p-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-6">
                  Start Your Journey Today
                </h2>
                <p className="text-lg text-base-content/80 mb-8 max-w-2xl mx-auto">
                  Join the StreamNET community and discover a better way to connect with people who matter most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/signup"
                    className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    Create Account
                  </Link>
                  <Link 
                    to="/login"
                    className="btn btn-ghost btn-lg hover:bg-base-200 transition-all duration-300"
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-base-200 border-t border-base-300 py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Video className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-base-content">StreamNET</span>
              </div>
              <p className="text-base-content/60">
                © 2024 StreamNET. Connecting the world, one conversation at a time.
              </p>
              <div className="flex justify-center space-x-6 mt-6">
                <Link to="/support" className="text-base-content/60 hover:text-primary transition-colors">
                  Support
                </Link>
                <span className="text-base-content/30">•</span>
                <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <span className="text-base-content/30">•</span>
                <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;