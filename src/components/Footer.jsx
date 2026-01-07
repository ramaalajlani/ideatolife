import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, // كل قسم يظهر بعد الآخر
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // منحنى انسيابي
    },
  },
};

const Footer = () => {
  return (
    <motion.footer
      className="mt-20 border-t py-10 border-neutral-700"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {/* معلومات التواصل */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-md font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-neutral-300">
              <div>info@idea2life.com</div>
              <div>+966 50 123 4567</div>
              <div>Syria, Damascus</div>
              <div>Sunday - Thursday: 9:00 AM - 6:00 PM</div>
            </div>
          </motion.div>

          {/* وسائل التواصل الاجتماعي */}
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2">
              {[
                { name: "Facebook", svg: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: "Twitter", svg: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                { name: "Instagram", svg: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" },
                { name: "LinkedIn", svg: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }
              ].map((social, idx) => (
                <a key={idx} href="#" className="flex items-center text-neutral-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.svg} />
                  </svg>
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* روابط سريعة */}
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {["About Us", "Our Services", "Success Projects", "Contact Us"].map((link, idx) => (
                <a key={idx} href={`#${link.toLowerCase().replace(/\s+/g, "")}`} className="block text-neutral-300 hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* حقوق النشر */}
        <motion.div variants={itemVariants} className="text-center mt-10 text-neutral-500">
          <p>&copy; 2026 Idea2Life. All rights reserved.</p>
          <p className="text-sm mt-2">Transforming Ideas into Reality</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
