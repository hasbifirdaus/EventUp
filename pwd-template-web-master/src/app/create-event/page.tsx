"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, LinkIcon, Calendar, MapPin, DollarSign, Star, Ticket, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface TicketType {
  id: string
  name: string
  price: number
  originalPrice?: number
  available: number
  description: string
  features: string[]
}

interface PromoCode {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  description: string
}

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: "",
    imageType: "upload" as "upload" | "url",
  })

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: "1",
      name: "Regular",
      price: 100000,
      available: 100,
      description: "Standard admission ticket",
      features: ["General admission", "Event materials"],
    },
  ])

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: "1",
      code: "EARLYBIRD",
      discount: 20,
      type: "percentage",
      description: "Early bird discount",
    },
  ])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setEventData({ ...eventData, image: url })
    setImagePreview(url)
  }

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      available: 0,
      description: "",
      features: [],
    }
    setTicketTypes([...ticketTypes, newTicket])
  }

  const updateTicketType = (id: string, field: keyof TicketType, value: any) => {
    setTicketTypes(ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
  }

  const removeTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== id))
  }

  const addPromoCode = () => {
    const newPromo: PromoCode = {
      id: Date.now().toString(),
      code: "",
      discount: 0,
      type: "percentage",
      description: "",
    }
    setPromoCodes([...promoCodes, newPromo])
  }

  const updatePromoCode = (id: string, field: keyof PromoCode, value: any) => {
    setPromoCodes(promoCodes.map((promo) => (promo.id === id ? { ...promo, [field]: value } : promo)))
  }

  const removePromoCode = (id: string) => {
    setPromoCodes(promoCodes.filter((promo) => promo.id !== id))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Event Data:", eventData)
    console.log("Ticket Types:", ticketTypes)
    console.log("Promo Codes:", promoCodes)
    alert("Event created successfully! (This is a demo)")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EventUp</span>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Event</h1>
            <p className="text-lg text-gray-600">Share your amazing event with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Event Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Event Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    placeholder="Describe your event"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    placeholder="Event location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={eventData.category}
                    onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                    placeholder="e.g., Technology, Music, Food"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Event Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={eventData.imageType === "upload" ? "default" : "outline"}
                    onClick={() => setEventData({ ...eventData, imageType: "upload" })}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </Button>
                  <Button
                    type="button"
                    variant={eventData.imageType === "url" ? "default" : "outline"}
                    onClick={() => setEventData({ ...eventData, imageType: "url" })}
                    className="flex items-center space-x-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Image URL</span>
                  </Button>
                </div>

                {eventData.imageType === "upload" ? (
                  <div>
                    <Label htmlFor="imageFile">Upload Image</Label>
                    <Input id="imageFile" type="file" accept="image/*" onChange={handleImageUpload} />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={eventData.image}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {imagePreview && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ticket className="w-5 h-5" />
                    <span>Ticket Types</span>
                  </div>
                  <Button type="button" onClick={addTicketType} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ticket
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Ticket Type {index + 1}</h4>
                      {ticketTypes.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeTicketType(ticket.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ticket Name</Label>
                        <Input
                          value={ticket.name}
                          onChange={(e) => updateTicketType(ticket.id, "name", e.target.value)}
                          placeholder="e.g., VIP, Regular, Business"
                        />
                      </div>
                      <div>
                        <Label>Price (IDR)</Label>
                        <Input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(ticket.id, "price", Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Available Quantity</Label>
                        <Input
                          type="number"
                          value={ticket.available}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "available", Number.parseInt(e.target.value) || 0)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Original Price (Optional)</Label>
                        <Input
                          type="number"
                          value={ticket.originalPrice || ""}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "originalPrice", Number.parseInt(e.target.value) || undefined)
                          }
                          placeholder="For showing discounts"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={ticket.description}
                        onChange={(e) => updateTicketType(ticket.id, "description", e.target.value)}
                        placeholder="Describe what's included"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Features (comma-separated)</Label>
                      <Input
                        value={ticket.features.join(", ")}
                        onChange={(e) =>
                          updateTicketType(
                            ticket.id,
                            "features",
                            e.target.value.split(", ").filter((f) => f.trim()),
                          )
                        }
                        placeholder="e.g., VIP seating, Welcome drink, Certificate"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promo Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Promo Codes</span>
                  </div>
                  <Button type="button" onClick={addPromoCode} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Promo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {promoCodes.map((promo, index) => (
                  <div key={promo.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Promo Code {index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removePromoCode(promo.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Promo Code</Label>
                        <Input
                          value={promo.code}
                          onChange={(e) => updatePromoCode(promo.id, "code", e.target.value.toUpperCase())}
                          placeholder="EARLYBIRD"
                        />
                      </div>
                      <div>
                        <Label>Discount</Label>
                        <Input
                          type="number"
                          value={promo.discount}
                          onChange={(e) => updatePromoCode(promo.id, "discount", Number.parseInt(e.target.value) || 0)}
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <select
                          value={promo.type}
                          onChange={(e) => updatePromoCode(promo.id, "type", e.target.value as "percentage" | "fixed")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (IDR)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={promo.description}
                        onChange={(e) => updatePromoCode(promo.id, "description", e.target.value)}
                        placeholder="Early bird discount for first 100 buyers"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Event Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  {imagePreview && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt={eventData.title}
                        className="w-full h-full object-cover"
                      />
                      {eventData.category && (
                        <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{eventData.category}</Badge>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{eventData.title || "Event Title"}</h3>
                    <p className="text-gray-600 mb-4">
                      {eventData.description || "Event description will appear here"}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {eventData.date ? new Date(eventData.date).toLocaleDateString("id-ID") : "Date"} •{" "}
                          {eventData.time || "Time"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{eventData.location || "Location"}</span>
                      </div>
                      {ticketTypes.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Starting from {formatPrice(Math.min(...ticketTypes.map((t) => t.price)))}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
                Create Event
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
