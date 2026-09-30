import Link from "next/link"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string
  shortDescription: string
  imageUrl: string
  slug: string
  companyName: string // Añade esta línea
}

export function ProjectCard({ title, shortDescription, imageUrl, slug, companyName }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <Link href={`/projects/${slug}`} className="block">
        <Image
          alt={title}
          className="w-full h-48 object-cover"
          height={300}
          src={imageUrl || "/placeholder.svg"}
          style={{
            aspectRatio: "400/300",
            objectFit: "cover",
          }}
          width={400}
        />
      </Link>
      <CardHeader className="p-4 pb-2 flex-grow">
        <CardTitle className="text-lg font-semibold">
          <Link href={`/projects/${slug}`} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </CardTitle>
        <p className="text-sm text-gray-500 mb-2">{companyName}</p> {/* Añade esta línea */}
        <CardDescription className="text-sm text-gray-600 line-clamp-3">{shortDescription}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href={`/projects/${slug}`}>Ver Proyecto</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
