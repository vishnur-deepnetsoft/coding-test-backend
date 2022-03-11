

import { Router, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import {getSuggestions}from '../../services/suggestions'

const router: Router = Router();

/**
 * @route  GET /suggestions
 * @description Endpoint that provides autocomplete suggestions for highly populated cities
 * @access Public
 * 
 */
router.get("/suggestions", async (req: Request, res: Response) => {
  try {
   
    const cities=await getSuggestions(req.query)
    return res.status(HttpStatusCodes.OK).json({ suggestions: cities });


  } catch (err) {
    console.error(err.message);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export { router as suggestionRouter } 