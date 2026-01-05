"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  LinkIcon,
  Calendar,
  Ticket,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import api from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
  isSeated: boolean;
  features: string[];
}

interface EventData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  category: string;
  image: string;
  imageType: "upload" | "url";
  isOnline: boolean;
}

const eventCategories = [
  "MUSIC",
  "SPORT",
  "SEMINAR",
  "WORKSHOP",
  "CONFERENCE",
  "OTHER",
];

const initialEventData: EventData = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  location: "",
  category: "",
  image: "",
  imageType: "upload",
  isOnline: false,
};

export default function CreateEventPage() {
  const [eventData, setEventData] = useState<EventData>(initialEventData);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleEventChange = (field: keyof EventData, value: string | boolean) =>
    setEventData((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleEventChange("image", url);
    setImagePreview(url);
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        available: 0,
        description: "",
        isSeated: false,
        features: [],
      },
    ]);
  };

  const updateTicketType = <K extends keyof TicketType>(
    id: string,
    field: K,
    value: TicketType[K]
  ) => {
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };
  const removeTicketType = (id: string) =>
    setTicketTypes((prev) => prev.filter((t) => t.id !== id));

  const resetForm = () => {
    setEventData(initialEventData);
    setTicketTypes([]);
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(
        `${eventData.startDate}T${eventData.startTime}:00`
      );
      const endDateTime = new Date(
        `${eventData.endDate}T${eventData.endTime}:00`
      );
      if (endDateTime <= startDateTime) {
        alert("End date/time must be after start date/time");
        return;
      }

      let imageUrl = eventData.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await api.post<{ url: string }>("/upload", formData);
        imageUrl = uploadRes.data.url;
      }

      const createEventRes = await api.post<{
        message: string;
        event: { id: string };
      }>("/events", {
        ...eventData,
        imageUrl,
        startDateTime,
        endDateTime,
      });

      const eventId = createEventRes.data.event.id;

      for (const ticket of ticketTypes) {
        await api.post(`/events/${eventId}/ticket-types`, {
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quota: ticket.available,
          isAvailable: true,
          isSeated: ticket.isSeated,
        });
      }

      alert("Event and tickets created successfully!");
      resetForm();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response?.data?.message === "string"
      ) {
        alert((error as any).response.data.message);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error(error);
        alert("Failed to create event");
      }
    }
  };

  const imageButtonVariants = (imageType: "upload" | "url") =>
    eventData.imageType === imageType ? "default" : "outline";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EventUp</span>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Event
            </h1>
            <p className="text-lg text-gray-600">
              Share your amazing event with the world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details */}
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
                    onChange={(e) => handleEventChange("title", e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) =>
                      handleEventChange("description", e.target.value)
                    }
                    placeholder="Describe your event"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={eventData.startDate}
                      onChange={(e) =>
                        handleEventChange("startDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) =>
                        handleEventChange("startTime", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={eventData.endDate}
                      onChange={(e) =>
                        handleEventChange("endDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) =>
                        handleEventChange("endTime", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={eventData.category}
                    onValueChange={(val) => handleEventChange("category", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-200">
                      {eventCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location / Online URL</Label>
                  <Input
                    type={eventData.isOnline ? "url" : "text"}
                    value={eventData.location}
                    onChange={(e) =>
                      handleEventChange("location", e.target.value)
                    }
                    placeholder={
                      eventData.isOnline
                        ? "https://zoom.us/..."
                        : "Event location"
                    }
                    required
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      className="w-4 h-4"
                      id="isOnline"
                      type="checkbox"
                      checked={eventData.isOnline}
                      onChange={(e) =>
                        handleEventChange("isOnline", e.target.checked)
                      }
                    />
                    <Label htmlFor="isOnline" className="mb-0">
                      Event Online
                    </Label>
                  </div>
                </div>

                {/* Event Image */}
                <div>
                  <Label>Event Image</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      type="button"
                      variant={imageButtonVariants("upload")}
                      onClick={() => handleEventChange("imageType", "upload")}
                      className="text-neutral-400"
                    >
                      <Upload className="w-4 h-4 mr-1" /> Upload
                    </Button>
                    <Button
                      type="button"
                      variant={imageButtonVariants("url")}
                      onClick={() => handleEventChange("imageType", "url")}
                      className="text-neutral-400"
                    >
                      <LinkIcon className="w-4 h-4 mr-1 " /> URL
                    </Button>
                  </div>
                  {eventData.imageType === "upload" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={eventData.image || ""}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-64 h-36 object-cover rounded-md"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5" />
                  <span>Ticket Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTypes.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="border border-gray-200 p-4 relative"
                  >
                    <div className="absolute -top-4 -right-4 bg-neutral-200 rounded-md">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTicketType(ticket.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={ticket.name}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicketType(
                              ticket.id,
                              "price",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Quota</Label>
                        <Input
                          type="number"
                          value={ticket.available}
                          onChange={(e) =>
                            updateTicketType(
                              ticket.id,
                              "available",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea
                        value={ticket.description}
                        onChange={(e) =>
                          updateTicketType(
                            ticket.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={ticket.isSeated}
                        onChange={(e) =>
                          updateTicketType(
                            ticket.id,
                            "isSeated",
                            e.target.checked
                          )
                        }
                      />
                      <Label className="mb-0">Seated Ticket</Label>
                    </div>
                  </Card>
                ))}
                <Button type="button" onClick={addTicketType}>
                  <Plus className="w-4 h-4 mr-1" /> Add Ticket Type
                </Button>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full cursor-pointer hover:bg-gray-300 hover:font-bold"
            >
              Create Event
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
