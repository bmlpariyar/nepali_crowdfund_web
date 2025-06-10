import React from 'react'
import logo from '../../assets/images/sahayog_logo-red.png'

const Footer = () => {
    return (
        <footer className="bg-indigo-600/60 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* <!-- Brand Section --> */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-indigo-300 rounded-lg flex items-center justify-center">
                                <img src={logo} alt="Sahayog Logo" className="w-8 h-8" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                                Sahayog
                            </span>
                        </div>
                        <p className="text-slate-100 leading-relaxed">
                            Empowering communities to create positive change through collaborative campaigns and collective action.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-slate-50 text-gray-600 shadow-lg hover:text-slate-100 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors duration-300">
                                <span className="text-lg">f</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-50 text-gray-600 shadow-lg hover:text-slate-100 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors duration-300">
                                <span className="text-lg">t</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-50 text-gray-600 shadow-lg hover:text-slate-100 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors duration-300">
                                <span className="text-lg">in</span>
                            </a>
                        </div>
                    </div>

                    {/* <!-- Quick Links --> */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Browse Campaigns</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Start a Campaign</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">How It Works</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Success Stories</a></li>
                        </ul>
                    </div>

                    {/* <!-- Categories --> */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Education</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Healthcare</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Environment</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Disaster Relief</a></li>
                        </ul>
                    </div>

                    {/* <!-- Support --> */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Help Center</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Contact Us</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-12 pt-8 text-center">
                    <p className="text-slate-100">
                        © 2025 Sahayog. All rights reserved. Made with ❤️ for communities everywhere.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer