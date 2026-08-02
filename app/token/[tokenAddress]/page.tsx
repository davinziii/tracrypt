import Dashboard from "@/components/Dashboard";

export default function TokenPage() {
  return (
        <div className="min-h-screen bg-black px-4 p-6"
            style={{ backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `, backgroundSize: "40px 40px",}}>
            <Dashboard />
        </div>
  )
 
}