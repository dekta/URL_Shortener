# URL_SHORTENER
## Introduction
This repository contains a sophisticated URL-shortening service developed to not only shorten URLs but also provide detailed analytics. 

## Contents
- [Installation & Getting started](#installation--getting-started)
- [Usage](#usage)
- [Deplolyed](#deplolyed-app)
- [Demo](#demo)
- [Built With](#built-with)
- [Approach Documentation](#approach-documentation)
    - [Analytics](#analytics)
    - [Scalability](#scalability)
- [APIs Documentation](#apis-documentation)
- [Tests](#tests)


## Installation & Getting started
- `git clone` the repo to your local machine. 
- To use this application, please run the following command:
    - `npm install`
    - `cd URL_Shortener_Backend`
- Type the following command in your termimal to run the server:
    - `npm run start:dev`


## Deplolyed App
Backend: ''

## Demo


## Built With
* Javascript
* NodeJS
* NestJS
* MongoDB
* Redis


## Approach Documentation
### Analytics
- Analytics solution provides detailed insights into URL usage. Here's an overview of the analytics features:
    - **Number of Clicks**: Tracks the total number of clicks on each shortened URL.
    - **Referral Sources**: Records the sources from which users accessed the shortened URLs.
    - **Time-based Click Analysis**: This feature enables users to identify peak usage times by analyzing the most active hours for URL clicks. By recording daily, weekly, and monthly click counts, users gain insights into usage patterns over different time intervals. We accomplish this by storing relevant data in our database and aggregating it to generate analytics reports. These reports are accessible via an API, allowing users to retrieve insights programmatically.
    - **Device and Browser Analysis**: This feature records the types of devices,os and browsers used to access the shortened URLs. It achieves this by utilizing the DeviceDetector npm package, which accurately identifies and categorizes the various devices and browsers accessing the URLs.

### Scalability 
- To ensure scalability, we can employ several strategies:
    - **Optimized Backend**: Our backend, built with Nest.js and TypeScript, is designed for efficiency and performance.
    - **Load Balancing**: Incoming traffic is evenly distributed across multiple instances using a load balancer. This ensures optimal resource utilization and prevents any individual server from being overwhelmed by traffic spikes.
    - **Database Scalability**: We can employ scalable database solutions that support horizontal scaling, such as sharding or replication. This allows us to handle growing data volumes and concurrent requests without sacrificing performance.
    - **Caching with Redis**: Redis is used for caching frequently accessed data, such as shortened URLs and analytics results.I By caching data in memory, we reduce the load on the database and improve response times for users.
    - **Rate Limiting**: To prevent abuse of the service and ensure fair usage, we implement rate limiting. Rate limiting controls the number of requests a user can make within a certain time period, helping to maintain system stability and performance under heavy loads.



## APIs Documentation

### Base API
- **Local** = `http://localhost:3000`
- **Deployed** = ``

### User Authentication APIs

| METHOD      | ENDPOINT    |  Request Body | DESCRIPTION |
| :---:       |    :----:   | :-----------: | :----------:|
| POST        | /auth/signup  | `name`,`email`,`password` |End-Point for users to register in the website |
| POST  | /auth/login  |`email`,`password`|  End-Point for users to register in the website |


###  Urls shortener and getting analytics of short url APIs

| METHOD      | ENDPOINT    |  Request Body | Response Body | DESCRIPTION |
| :---:       |    :----:   | :-----------: | :----------:| :----------:|
| POST        | /urls/shorturl  | `longUrl`| `shortUrl`|End-Point for users to convert long url into short url|
| GET  | /urls/allshorturls  | |array of object, in the object = [`urlCode`,`longUrl`,`shortUrl`,`clicks`,`createdAt`,`userName`] |  Endpoint to retrieve all short URLs created by the user along with their details |
| GET  | /urlstats/:urlCode  | | `dailyClicked`,`weeklyClicked`,`monthlyClicked`,`urlInfo` with url stats. In the stats,details of device used to access shorturl [`devicetype`,`os`,`browser`,`clickedAt`]|Endpoint to retrieve stats related to short URL like clicks, device details from where URL used |


