"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

// Mock data for occupation classifications
const mockOccupations = [
  {
    id: 1,
    title: "Infantry Team Leader",
    nco2015: "11-1011.00",
    nco2004: "55-1011.00",
    division: "Military Specific Occupations",
    subdivision: "Combat Arms",
    group: "Infantry and Gun Crews",
    family: "Infantry",
    similarity: 0.95,
  },
  {
    id: 2,
    title: "Information Technology Specialist",
    nco2015: "15-1142.00",
    nco2004: "15-1051.00",
    division: "Computer and Mathematical Occupations",
    subdivision: "Computer Specialists",
    group: "Computer Support Specialists",
    family: "Information Technology",
    similarity: 0.92,
  },
  {
    id: 3,
    title: "Combat Medic",
    nco2015: "31-9099.01",
    nco2004: "31-9099.00",
    division: "Healthcare Support Occupations",
    subdivision: "Other Healthcare Support Occupations",
    group: "Medical Assistants and Other Healthcare Support",
    family: "Healthcare",
    similarity: 0.89,
  },
  {
    id: 4,
    title: "Intelligence Analyst",
    nco2015: "19-3033.00",
    nco2004: "19-3022.00",
    division: "Life, Physical, and Social Science Occupations",
    subdivision: "Social Scientists and Related Workers",
    group: "Miscellaneous Social Scientists and Related Workers",
    family: "Intelligence",
    similarity: 0.87,
  },
  {
    id: 5,
    title: "Military Police Officer",
    nco2015: "33-3051.00",
    nco2004: "33-3051.00",
    division: "Protective Service Occupations",
    subdivision: "Law Enforcement Workers",
    group: "Police and Detectives",
    family: "Law Enforcement",
    similarity: 0.85,
  },
  {
    id: 6,
    title: "Aviation Mechanic",
    nco2015: "49-3011.00",
    nco2004: "49-3011.00",
    division: "Installation, Maintenance, and Repair Occupations",
    subdivision: "Vehicle and Mobile Equipment Mechanics",
    group: "Aircraft and Avionics Equipment Mechanics",
    family: "Aviation",
    similarity: 0.83,
  },
  {
    id: 7,
    title: "Communications Specialist",
    nco2015: "27-4014.00",
    nco2004: "27-4014.00",
    division: "Media and Communication Occupations",
    subdivision: "Media and Communication Equipment Workers",
    group: "Broadcast and Sound Engineering Technicians",
    family: "Communications",
    similarity: 0.81,
  },
  {
    id: 8,
    title: "Supply Chain Manager",
    nco2015: "11-3071.00",
    nco2004: "11-3071.00",
    division: "Management Occupations",
    subdivision: "Operations Specialties Managers",
    group: "Transportation, Storage, and Distribution Managers",
    family: "Logistics",
    similarity: 0.79,
  },
  {
    id: 9,
    title: "Cyber Security Analyst",
    nco2015: "15-1212.00",
    nco2004: "15-1199.00",
    division: "Computer and Mathematical Occupations",
    subdivision: "Computer Specialists",
    group: "Information Security Analysts",
    family: "Cybersecurity",
    similarity: 0.77,
  },
  {
    id: 10,
    title: "Field Artillery Officer",
    nco2015: "55-1017.00",
    nco2004: "55-1017.00",
    division: "Military Specific Occupations",
    subdivision: "Combat Arms",
    group: "Artillery and Missile Crews",
    family: "Artillery",
    similarity: 0.75,
  },
  {
    id: 11,
    title: "Human Resources Specialist",
    nco2015: "13-1071.00",
    nco2004: "13-1071.00",
    division: "Business and Financial Operations Occupations",
    subdivision: "Human Resources Workers",
    group: "Human Resources Specialists",
    family: "Human Resources",
    similarity: 0.73,
  },
  {
    id: 12,
    title: "Logistics Coordinator",
    nco2015: "43-5061.00",
    nco2004: "43-5061.00",
    division: "Office and Administrative Support Occupations",
    subdivision: "Material Recording, Scheduling, Dispatching",
    group: "Production, Planning, and Expediting Clerks",
    family: "Logistics",
    similarity: 0.71,
  },
]

export default function NCODataSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [searchType, setSearchType] = useState("exact")
  const [semanticPageSize, setSemanticPageSize] = useState(10)

  const filterOccupations = (searchTerm: string) => {
    if (!searchTerm) return mockOccupations
    return mockOccupations.filter(
      (occupation) =>
        occupation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        occupation.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        occupation.family.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const filteredData = filterOccupations(searchTerm)

  const getPaginatedData = (data: typeof mockOccupations, currentPage: number, pageSize = 10) => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (dataLength: number, pageSize = 10) => Math.ceil(dataLength / pageSize)

  const pageSize = searchType === "semantic" ? semanticPageSize : 10
  const paginatedData = getPaginatedData(filteredData, currentPage, pageSize)
  const totalPages = getTotalPages(filteredData.length, pageSize)

  const handleSearch = () => {
    setShowResults(true)
    setCurrentPage(1)
  }

  const handleSemanticPageSizeChange = (size: number) => {
    setSemanticPageSize(size)
    setCurrentPage(1)
  }

  const getSliderValue = () => {
    const sizeMap = [10, 50, 100, 500, filteredData.length]
    return [sizeMap.indexOf(semanticPageSize)]
  }

  const getSliderLabel = () => {
    if (semanticPageSize === filteredData.length) return "All"
    return semanticPageSize.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-6">
            {/* Government Logo Placeholder */}
            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
              <span className="text-xs font-mono text-muted-foreground">GOV</span>
            </div>

            {/* Title and Subtitle */}
            <div className="flex-1">
              <h1 className="font-mono text-2xl font-bold text-foreground">NCO-2015 Data Search</h1>
              <p className="text-sm text-muted-foreground">statathon 2025 • team etl • vasavi college of engineering</p>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-12 items-center justify-center rounded bg-muted">
                <span className="text-xs font-mono text-muted-foreground">ETL</span>
              </div>
              <div className="flex h-8 w-12 items-center justify-center rounded bg-muted">
                <span className="text-xs font-mono text-muted-foreground">HACK</span>
              </div>
              <div className="flex h-8 w-12 items-center justify-center rounded bg-muted">
                <span className="text-xs font-mono text-muted-foreground">VCE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="font-mono text-xl">Search Occupation Database</CardTitle>
            <p className="text-muted-foreground">
              Find NCO occupation classifications using exact match or semantic search
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="exact" className="font-mono">
                  Exact Match
                </TabsTrigger>
                <TabsTrigger value="semantic" className="font-mono">
                  Semantic Search
                </TabsTrigger>
              </TabsList>

              {/* Exact Search Tab */}
              <TabsContent value="exact" className="space-y-6">
                <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter search terms... (Exact matches only)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg bg-white"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="px-8 rounded-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>

              {/* Semantic Search Tab */}
              <TabsContent value="semantic" className="space-y-6">
                <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter search terms for semantic matching..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg bg-white"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button onClick={handleSearch} className="px-8 rounded-full">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Show:</span>
                      <div className="relative bg-white border rounded-full p-0.5 flex items-center justify-between shadow-sm">
                        {[10, 50, 100, 500, filteredData.length].map((size, index) => (
                          <button
                            key={size}
                            onClick={() => handleSemanticPageSizeChange(size)}
                            className={`relative z-10 px-2 py-1 text-xs font-mono font-medium rounded-full transition-colors ${
                              semanticPageSize === size ? "text-white" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {size === filteredData.length ? "All" : size}
                          </button>
                        ))}
                        {/* Sliding indicator */}
                        <div
                          className="absolute top-0.5 bottom-0.5 bg-primary rounded-full transition-all duration-200 ease-out"
                          style={{
                            left: `${[10, 50, 100, 500, filteredData.length].indexOf(semanticPageSize) * 20 + 1}%`,
                            width: "18%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Occupation Titles</CardTitle>
              <p className="text-sm text-muted-foreground">{filteredData.length} results found</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">#</TableHead>
                      <TableHead className="font-mono">Occupation Title</TableHead>
                      <TableHead className="font-mono">NCO 2015</TableHead>
                      <TableHead className="font-mono">NCO 2004</TableHead>
                      <TableHead>{/* Division */}</TableHead>
                      <TableHead>{/* Subdivision */}</TableHead>
                      <TableHead>{/* Group */}</TableHead>
                      <TableHead>{/* Family */}</TableHead>
                      {searchType === "semantic" && <TableHead className="font-mono">Similarity Ranking</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((occupation, index) => (
                      <TableRow key={occupation.id}>
                        <TableCell className="font-mono">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                        <TableCell className="font-medium">{occupation.title}</TableCell>
                        <TableCell className="font-mono">{occupation.nco2015}</TableCell>
                        <TableCell className="font-mono">{occupation.nco2004}</TableCell>
                        <TableCell>{occupation.division}</TableCell>
                        <TableCell>{occupation.subdivision}</TableCell>
                        <TableCell>{occupation.group}</TableCell>
                        <TableCell>{occupation.family}</TableCell>
                        {searchType === "semantic" && (
                          <TableCell className="font-mono">{occupation.similarity.toFixed(2)}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
