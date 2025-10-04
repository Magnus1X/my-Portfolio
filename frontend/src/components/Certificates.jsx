import React, { useEffect, useRef, useState } from 'react'
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react'
import { certificatesAPI, userAPI, getFileUrl } from '../utils/api'

const Certificates = () => {
  const [certificates, setCertificates] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const certificatesRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificatesAPI.getAll()
        setCertificates(response.data)
      } catch (error) {
        console.error('Error fetching certificates:', error)
        // Set fallback certificates
        setCertificates([
          {
            id: '1',
            title: 'Full Stack Web Development',
            issuer: 'FreeCodeCamp',
            issueDate: '2023-06-15',
            credentialId: 'FCC-FSWD-2023',
            credentialUrl: 'https://freecodecamp.org/certification/sauravkumar/full-stack-web-development',
            imageUrl: ''
          },
          {
            id: '2',
            title: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            issueDate: '2023-09-20',
            credentialId: 'AWS-DEV-123456',
            credentialUrl: 'https://aws.amazon.com/verification',
            imageUrl: ''
          },
          {
            id: '3',
            title: 'React Developer Certification',
            issuer: 'Meta',
            issueDate: '2023-03-10',
            credentialId: 'META-REACT-789',
            credentialUrl: 'https://coursera.org/verify/react-cert',
            imageUrl: ''
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.get()
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user info:', error)
        setUserInfo({ cvUrl: '/uploads/cv-1759516793167-968302336.pdf' })
      }
    }

    fetchUserInfo()
  }, [])

  useEffect(() => {
    const animateCertificates = async () => {
      if (!contentRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        // Animate certificate cards with flip effect
        gsap.fromTo(contentRef.current.querySelectorAll('.certificate-card'),
          { opacity: 0, y: 50, rotationY: -90 },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: certificatesRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        )
      } catch (error) {
        console.warn('GSAP not available for certificates animation')
      }
    }

    animateCertificates()
  }, [loading])

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <section id="certificates" className="min-h-screen flex items-center justify-center scroll-mt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificates...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="certificates" ref={certificatesRef} className="min-h-screen flex items-center section-padding scroll-mt-24">
      <div className="container-custom">
        <div ref={contentRef} className="space-y-16">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Certificates</span> & Achievements
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional certifications and learning milestones
            </p>
          </div>

          {/* Certificates Row (single-line with horizontal scroll) */}
          {certificates.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex items-stretch space-x-6 pb-2">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="flex-shrink-0 w-80">
                    <CertificateCard certificate={certificate} formatDate={formatDate} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={48} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
              <p className="text-gray-400">Certificates will appear here once added through the admin panel.</p>
            </div>
          )}

          
        </div>
      </div>
    </section>
  )
}

const CertificateCard = ({ certificate, formatDate }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="certificate-card card group overflow-hidden perspective-1000 preserve-3d backface-hidden">
      {/* Certificate Image */}
      <div className="relative h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
        {certificate.imageUrl ? (
          <img
            src={certificate.imageUrl}
            alt={certificate.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-500/20 to-blue-600/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award size={32} className="text-accent-500" />
              </div>
              <p className="text-gray-400 text-sm">Certificate</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              aria-label="View certificate"
            >
              <ExternalLink size={20} className="text-white" />
            </a>
          )}
        </div>
      </div>

      {/* Certificate Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-500 transition-colors duration-300">
            {certificate.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Issued by <span className="text-accent-500 font-medium">{certificate.issuer}</span>
          </p>
        </div>

        {/* Certificate Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar size={14} />
            <span className="text-sm">{formatDate(certificate.issueDate)}</span>
          </div>
          
          {certificate.credentialId && (
            <div className="text-xs text-gray-500 font-mono">
              ID: {certificate.credentialId}
            </div>
          )}
        </div>

        {/* Certificate Link */}
        {certificate.credentialUrl && (
          <div className="pt-2">
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-accent-500 hover:text-accent-400 transition-colors duration-300"
            >
              <ExternalLink size={14} />
              <span className="text-sm font-medium">Verify Certificate</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Certificates
