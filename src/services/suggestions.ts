import * as fs from 'fs';
import * as path from 'path';
import Parser from 'tsv';
import City from '../models/city';
import { PipelineStage } from 'mongoose';

/**
 * @service suggestion
 * @description create a seed data for db
 * @function seedData
 */
export async function seedData() {
  try {
    const results = await City.find();
    if (results.length > 0) {
      return true;
    }
    const location = path.join(
      __dirname,
      '../../../seed/cities_canada-usa.tsv',
    );
    const data = fs.readFileSync(location, { encoding: 'utf8' });
    const parser = Parser.TSV;
    const parsedData = parser.parse(data);
    const promises = parsedData.map(async (el) => {
      const coordinates = [];
      if (el.long && el.lat) {
        coordinates.push(Number(el.long));
        coordinates.push(Number(el.lat));
        el.location = {
          type: 'Point',
          coordinates: coordinates,
        };
        return City.create(el);
      }
    });
    return await Promise.all(promises);
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * @service suggestion
 * @description get cities
 * @function getSuggestions
 */
export async function getSuggestions(payload: any) {
  try {
    const q: string = payload.q.toString();
    let sort;
    if (payload.sort) {
      sort = payload.sort.toString();
    }
    const radius = payload.radius;
    let distance = 0;
    if (radius) {
      distance = Number(radius);
    }
    let query;
    if (payload.longitude && payload.latitude) {
      const longitude = Number(payload.longitude);
      const latitude = Number(payload.latitude);
      query = getMatchQuery(q, longitude, latitude, distance, sort);
    } else {
      query = getMatchQueryWithNoLatAndLong(q, sort);
    }
    const results = await City.aggregate(query);
    return results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * @service suggestion
 * @description Return aggregation query
 * @function getMatchQuery
 */

export function getMatchQuery(
  q: string,
  longitude: number,
  latitude: number,
  radius: number,
  sort: string,
): Array<PipelineStage> {
  return [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: 'dist.calculated',
        maxDistance: radius * 1000,
        query: { name: new RegExp(q, 'i') },
        includeLocs: 'dist.location',
        spherical: true,
      },
    },
    {
      $addFields: { distance: { $divide: ['$dist.calculated', 1000] } },
    },
    {
      $addFields: { latitude: { $toDouble: '$lat' } },
    },
    {
      $addFields: { longitude: { $toDouble: '$long' } },
    },
    {
      $addFields: {
        name: {
          $concat: ['$name', ',', '$admin1', ',', '$country'],
        },
      },
    },
    {
      $project: {
        name: 1,
        latitude: 1,
        longitude: 1,
        distance: 1,
      },
    },
    {
      $sort: { [sort]: 1 },
    },
  ];
}

/**
 * @service suggestion
 * @description Return aggregation query with params only q and sort
 * @function getMatchQueryWithNoLatAndLong
 */

export function getMatchQueryWithNoLatAndLong(
  q: string,
  sort: string,
): Array<PipelineStage> {
  return [
    {
      $addFields: { latitude: { $toDouble: '$lat' } },
    },
    {
      $addFields: { longitude: { $toDouble: '$long' } },
    },
    {
      $addFields: {
        name: {
          $concat: ['$name', ',', '$admin1', ',', '$country'],
        },
      },
    },
    {
      $addFields: {
        name: {
          $concat: ['$name', ',', '$admin1', ',', '$country'],
        },
      },
    },
    {
      $match: {
        name: new RegExp(q, 'i'),
      },
    },
    {
      $project: {
        name: 1,
        latitude: 1,
        longitude: 1,
        distance: 1,
      },
    },
    {
      $sort: { [sort]: 1 },
    },
  ];
}
