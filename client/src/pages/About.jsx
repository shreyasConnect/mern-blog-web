
export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About TechSavvy Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              <strong style={{ color: 'white' }}>Welcome to TechSavvyBlog</strong>
              <br></br>
              At TechSavvyBlog, we're passionate about exploring the ever-evolving world of technology and sharing our insights with you. Whether you're a tech enthusiast, a budding entrepreneur, or simply curious about the latest innovations, you've come to the right place.

            </p>

            <p>
              <strong style={{ color: 'white' }}>Our Team</strong>
              <br></br>
              Behind TechSavvyBlog is a dedicated team of tech enthusiasts, writers, and industry experts who are passionate about sharing their knowledge and expertise with you. With diverse backgrounds and experiences, our team brings a unique perspective to the table, ensuring that you receive well-rounded and comprehensive coverage of all things tech.

            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
