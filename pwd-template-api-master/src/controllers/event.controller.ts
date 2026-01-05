import { Request, Response } from "express";
import prisma from "../utils/prisma";

// API untuk membuat event baru (hanya untuk organizer)
export const createEvent = async (req: any, res: Response) => {
  try {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      imageUrl,
      category,
    } = req.body;
    const organizerId = req.user.userId;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        location,
        imageUrl,
        category,
        organizerId,
      },
    });

    res
      .status(201)
      .json({ message: "Event berhasil dibuat.", event: newEvent });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Terjadi kesalahan pada server.",
      error: error.name || "InternalServerError",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      path: req.originalUrl,
    });
  }
};

// API untuk melihat semua event
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      include: {
        organizer: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        startDateTime: "asc",
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

//API Untuk melihat detail evetn
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

//Function untuk updateEvent
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      imageUrl,
      category,
      isActive,
    } = req.body;

    const updateEvent = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        startDateTime: startDateTime ? new Date(startDateTime) : undefined,
        endDateTime: endDateTime ? new Date(endDateTime) : undefined,
        location,
        imageUrl,
        category,
        isActive,
      },
    });
    res.status(200).json(updateEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

//Function untuk deleteEvent
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send(); //No Content
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getOrganizerEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const userId = req.user.userId;
    const now = new Date(); // Mengambil semua event milik organizer

    const allEvents = await prisma.event.findMany({
      where: {
        organizerId: userId,
      },
      orderBy: {
        startDateTime: "asc",
      },
    }); // Mengelompokkan event berdasarkan status

    const activeEvents = allEvents.filter(
      (event) => event.isActive && event.endDateTime > now
    );
    const draftEvents = allEvents.filter((event) => !event.isActive);
    const pastEvents = allEvents.filter(
      (event) => event.isActive && event.endDateTime < now
    );

    res.status(200).json({
      activeEvents,
      draftEvents,
      pastEvents,
    });
  } catch (error) {
    console.error("Gagal mengambil event organizer:", error);
    res.status(500).json({ message: "Gagal mengambil daftar event." });
  }
};
