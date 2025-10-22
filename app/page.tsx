import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Hisab360</div>
          <div className="flex gap-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Manage Your Finances with Confidence</h1>
          <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
            Track income, expenses, bank accounts, and rent payments all in one place. Built for Bangladesh, designed
            for simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
            <button className="btn-secondary text-lg px-8 py-3">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Income Tracking",
                description: "Track all your income sources including salary, freelance work, and investments",
              },
              {
                title: "Expense Management",
                description: "Categorize and monitor your daily expenses with detailed analytics",
              },
              {
                title: "Rent Management",
                description: "Manage tenant payments and track rent collection effortlessly",
              },
              {
                title: "Bank Accounts",
                description: "Monitor multiple bank accounts and track your total balance",
              },
              {
                title: "Reports & Analytics",
                description: "Generate detailed reports and export to PDF or Excel",
              },
              {
                title: "Multi-Language",
                description: "Full support for English and Bengali languages",
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
