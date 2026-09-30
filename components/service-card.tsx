import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  name: string
  shortDescription: string
  price: number
  imageUrl: string
  slug: string
}

export function ServiceCard({ name, shortDescription, price, imageUrl, slug }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/services/${slug}`} className="block">
        <Image
          alt={name}
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
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold">
          <Link href={`/services/${slug}`} className="hover:text-blue-600 transition-colors">
            {name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">{shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="text-xl font-bold text-blue-700">${price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href={`/services/${slug}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
