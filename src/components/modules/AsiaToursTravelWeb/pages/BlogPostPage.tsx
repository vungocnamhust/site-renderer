import type { AsiaToursTravelWebData, Blog } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BlogDetailLayout } from '../components/BlogDetail/BlogDetailLayout'
import '../blog.css' // Import custom blog styles

interface BlogPostPageProps {
  data: AsiaToursTravelWebData
  blogSlug: string
  blog?: Blog  // Can be pre-fetched full blog from dispatcher
}

export function BlogPostPage({ data, blogSlug, blog: preFetchedBlog }: BlogPostPageProps) {
  const { siteSettings, navigation, footer, featuredBlogs } = data

  // Use pre-fetched blog if available, otherwise try from featuredBlogs
  let blog = preFetchedBlog || 
    (featuredBlogs?.find(b => typeof b !== 'string' && b.slug === blogSlug) as Blog | undefined)

  // Fallback for the specific high-fidelity demo if not in DB yet
  if (!blog && (blogSlug === 'vietnams-boutique-hotel-resort-treasures-unique-luxury-stays-to-explore' || blogSlug === 'vietnams-boutique-hotel-resort-treasures-unique-luxury-stays-to-explore.html')) {
      blog = {
          id: 999999, // Demo ID (number type)
          title: "Vietnam's Boutique Hotel & Resort Treasures: Unique Luxury Stays to Explore",
          slug: 'vietnams-boutique-hotel-resort-treasures-unique-luxury-stays-to-explore',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          // Content is handled in Layout via htmlContent fallback
      } as Blog
  }

  if (!blog) {
      return (
        <div className="app">
             <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
             <div className="container py-20 text-center">
                 <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
                 <p>The requested blog post could not be found.</p>
             </div>
             <Footer data={footer} />
        </div>
      )
  }

  // Filter recent posts from featuredBlogs
  const recentPosts = featuredBlogs?.filter((b): b is Blog => typeof b !== 'string' && b.slug !== blogSlug) || []

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <BlogDetailLayout blog={blog} recentPosts={recentPosts} />

      <Footer data={footer} />
    </div>
  )
}
