"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { exactSearch, semanticSearch, fetchAllData } from "@/lib/api"


type Occupation = {
  occupation_title: string
  nco_2015: string
  nco_2004: string
  division: string
  subdivision: string
  group: string
  family: string
  similarity_score?: number
}

export default function NCODataSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [searchType, setSearchType] = useState("exact")
  const [semanticPageSize, setSemanticPageSize] = useState(10)
  const [results, setResults] = useState<Occupation[]>([])
  const [loading, setLoading] = useState(false)


  const filteredData: Occupation[] = results || []

  const fullDatasetSize = 500;
  const pageSizes = [10, 50, 100];
  if (!pageSizes.includes(fullDatasetSize)) pageSizes.push(fullDatasetSize);

  const runSearch = async () => {
    setLoading(true)
    try {
      if (searchType === "exact") {
        const data = await exactSearch(searchTerm)
        setResults(data)
      } else {
        const data = await semanticSearch(searchTerm, semanticPageSize)
        setResults(data)
      }
      setShowResults(true)
      setCurrentPage(1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedData = (data: Occupation[], currentPage: number, pageSize = 10) => {
    if (!data || data.length === 0) return []
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (dataLength: number, pageSize = 20) => Math.ceil(dataLength / pageSize)

  const pageSize = searchType === "semantic" ? semanticPageSize : 20
  const paginatedData = getPaginatedData(filteredData, currentPage, pageSize)
  const totalPages = getTotalPages(filteredData.length, pageSize)

  const handleSearch = () => {
    runSearch()
    setShowResults(true)
    setCurrentPage(1)
  }

  const handleSemanticPageSizeChange = (size: number) => {
    setSemanticPageSize(size)
    setCurrentPage(1)
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-6">
            {/* Title and Subtitle */}
            <div className="flex-1">
              <h1 className="font-mono text-2xl font-bold text-foreground">NCO-2015 Data Search</h1>
              <p className="text-sm text-muted-foreground">statathon 2025 • team ETL • vasavi college of engineering</p>
            </div>

            <div className="flex gap-4">
              <div className="h-15 w-15">
                <img
                  src="/etl_logo.png" // place etl_logo.png in the public/ folder
                  alt="ETL"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="h-16 w-16">
                <img
                  src="/st25_logo.png"
                  alt="STATATHON"
                  className="h-full w-full object-contain"
                />
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
                        {pageSizes.map((size) => (
                          <button
                            key={size} // unique key
                            onClick={() => handleSemanticPageSizeChange(size)}
                            className={`relative z-10 px-2 py-1 text-xs font-mono font-medium rounded-full transition-colors ${
                              semanticPageSize === size ? "text-white" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {size === fullDatasetSize ? "All" : size}
                          </button>
                        ))}
                        {/* Sliding indicator */}
                        <div
                          className="absolute top-0.5 bottom-0.5 bg-primary rounded-full transition-all duration-200 ease-out"
                          style={{
                            left: `${pageSizes.indexOf(semanticPageSize) * (100 / pageSizes.length)}%`,
                            width: `${100 / pageSizes.length}%`,
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
                      <TableHead className="font-mono">Division</TableHead>
                      <TableHead className="font-mono">Subdivision</TableHead>
                      <TableHead className="font-mono">Group</TableHead>
                      <TableHead className="font-mono">Family</TableHead>
                      {searchType === "semantic" && <TableHead className="font-mono">Similarity Ranking</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((occupation, index) => (
                        <TableRow key={occupation.nco_2015}>
                          <TableCell className="font-mono">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                          <TableCell className="font-medium">{occupation.occupation_title}</TableCell>
                          <TableCell className="font-mono">{occupation.nco_2015}</TableCell>
                          <TableCell className="font-mono">{occupation.nco_2004}</TableCell>
                          <TableCell>{occupation.division}</TableCell>
                          <TableCell>{occupation.subdivision}</TableCell>
                          <TableCell>{occupation.group}</TableCell>
                          <TableCell>{occupation.family}</TableCell>
                          {searchType === "semantic" && (
                            <TableCell className="font-mono">{occupation.similarity_score?.toFixed(2) ?? "-"}</TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={searchType === "semantic" ? 9 : 8} className="text-center text-muted-foreground">
                          No results found
                        </TableCell>
                      </TableRow>
                    )}
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
