import React from 'react';


const ContactUs = () => {
  return (
    <div className="bg-[#fbf7f2] min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 border border-[#e6ddd2]">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center tracking-[3px] text-[#9c7c3a] uppercase">Contact Us</h1>
        <p className="mb-8 text-center max-w-2xl mx-auto text-[#3b3b3b] text-base md:text-lg font-sans font-light">
          We'd love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
        </p>
        <form className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-[#e6ddd2] bg-[#fbf7f2] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] font-sans text-[#3b3b3b]"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-[#e6ddd2] bg-[#fbf7f2] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] font-sans text-[#3b3b3b]"
            required
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="border border-[#e6ddd2] bg-[#fbf7f2] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] font-sans text-[#3b3b3b]"
            required
          />
          <button
            type="submit"
            className="bg-[#9c7c3a] text-white rounded px-6 py-3 font-serif font-semibold tracking-[1px] hover:bg-[#8a6a2f] transition-colors mt-2"
          >
            Send Message
          </button>
        </form>
        <div className="mt-10 text-center text-[#3b3b3b] text-base font-sans">
          <p className="mb-1">Email: <a href="mailto:support@mywebseller.com" className="text-[#9c7c3a] hover:underline">support@mywebseller.com</a></p>
          <p className="mb-1">Phone: <a href="tel:+1234567890" className="text-[#9c7c3a] hover:underline">+1 234 567 890</a></p>
          <p>Address: 123 Main Street, City, Country</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
