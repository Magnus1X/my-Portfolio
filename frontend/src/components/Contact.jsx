import React, { useEffect, useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Download, Code2, Trophy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { contactAPI, userAPI, getFileUrl } from '../utils/api'

const Contact = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const contactRef = useRef(null)
  const contentRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.get()
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user info:', error)
        setUserInfo({
          email: 'contact@sauravkumar.dev',
          location: 'India'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  useEffect(() => {
    const animateContact = async () => {
      if (!contentRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contactRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        )
      } catch (error) {
        console.warn('GSAP not available for contact animation')
      }
    }

    animateContact()
  }, [loading])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await contactAPI.send(data)
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section id="contact" className="min-h-screen flex items-center justify-center scroll-mt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading contact form...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" ref={contactRef} className="min-h-screen flex items-center section-padding scroll-mt-24">
      <div className="container-custom">
        <div ref={contentRef} className="space-y-16">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how I can help bring your ideas to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question, want to collaborate, or just want to say hi, 
                  feel free to reach out!
                </p>
                {/* Download CV button shown in Get In Touch section */}
                {userInfo?.cvUrl && (
                  <div className="pt-2">
                    <a
                      href={getFileUrl(userInfo.cvUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Download size={20} />
                      <span>Download CV</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <a 
                      href={`mailto:${userInfo?.email}`}
                      className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
                    >
                      {userInfo?.email || 'contact@sauravkumar.dev'}
                    </a>
                    {/* Competitive programming/social links beside email */}
                    <div className="flex items-center space-x-4 mt-3">
                      {userInfo?.codeforces && (
                        <a
                          href={`https://codeforces.com/profile/${userInfo.codeforces}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
                          aria-label="Codeforces"
                        >
                          <Code2 size={20} />
                        </a>
                      )}
                      {userInfo?.leetcode && (
                        <a
                          href={`https://leetcode.com/${userInfo.leetcode}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
                          aria-label="LeetCode"
                        >
                          <Trophy size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Location</h4>
                    <p className="text-gray-400">{userInfo?.location || 'India'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Availability</h4>
                    <p className="text-gray-400">Available for freelance work</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="card p-6">
                <h4 className="text-white font-medium mb-3">Response Time</h4>
                <p className="text-gray-400 text-sm">
                  I typically respond to emails within 24 hours. For urgent matters, 
                  please mention it in your message.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle size={16} />
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle size={16} />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject', { 
                      required: 'Subject is required',
                      minLength: {
                        value: 5,
                        message: 'Subject must be at least 5 characters'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle size={16} />
                      <span>{errors.subject.message}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle size={16} />
                      <span>{errors.message.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
