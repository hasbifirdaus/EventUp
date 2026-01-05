import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Buat TicketType baru untuk acara tertentu
export const createTicketType = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { name, description, price, quota, isAvailable, isSeated } = req.body;

    const newTicketType = await prisma.ticketType.create({
      data: {
        eventId: parseInt(eventId),
        name,
        description,
        price,
        quota,
        isAvailable,
        isSeated,
      },
    });
    res.status(201).json(newTicketType);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat jenis tiket.", error });
  }
};

//Get all TicketTypes untuk specific event
export const getTicketTypesByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        eventId: parseInt(eventId),
      },
    });
    res.status(200).json(ticketTypes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve ticket types.", error });
  }
};
