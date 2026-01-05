"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-6 bg-blue-600 rounded-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 transform -translate-x-1/2"></div>
                <div className="flex flex-col items-center justify-center space-y-px">
                  <div className="w-3 h-px bg-white/60"></div>
                  <div className="w-2 h-px bg-white/60"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">EventUp</span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white py-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">About EventUp</h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
              We're passionate about connecting people with amazing experiences. EventUp makes discovering and booking
              events simple, enjoyable, and accessible for everyone.
            </p>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-16 bg-gray-100"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                To make event discovery effortless and help people create unforgettable memories through amazing
                experiences. We believe every event has the power to bring people together and create lasting
                connections.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-16 bg-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <p className="text-lg text-gray-600">
                The passionate individuals behind EventUp who work tirelessly to bring you the best event experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Jonathan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">J</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Jonathan</h3>
                    <p className="text-blue-600 font-medium mb-4">Co-Founder & CEO</p>
                    <p className="text-gray-600 mb-6">
                      Passionate about technology and events, Jonathan leads our vision to revolutionize how people
                      discover and attend events.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>+62 878-6889-8855</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hasbi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">H</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hasbi</h3>
                    <p className="text-green-600 font-medium mb-4">Co-Founder & CTO</p>
                    <p className="text-gray-600 mb-6">
                      With expertise in software development and user experience, Hasbi ensures our platform delivers
                      seamless event discovery.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>+62 812-9264-5690</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-16 bg-blue-600"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-xl text-blue-100 mb-8">
              Have questions or want to partner with us? We'd love to hear from you.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
