# Finding Shortest Flight Path API

This API helps you find the shortest route between two airports using their IATA or ICAO codes. As a bonus it also gives you alternative paths and also helps to find where you can do ground hops within 100kms distance.

![image](https://github.com/user-attachments/assets/49bb93bf-4daf-487a-8b81-e6e6404e072d)

## Technologies used:

1. **Node.js**
2. **JavaScript ES6** 
3. **Express**
4. **[GeoLib](https://www.npmjs.com/package/geolib?activeTab=readme)** for basic geospatial operations like distance calculation and center calculations between two coordinates. 



## Instructions to run the Application:

1. Clone the project from GitHub.

```sh
   git clone https://github.com/codeking4u/book-my-flight2.git
```
2. Install the dependencies

```sh
npm install
```

3. Start the Application

```sh
npm start
```

This application is using port 3000, so if this is localhost, then the server URL would be localhost:3000/ with json request data in body as shown below.

## Endpoints

### 1. Get Shortest Route
- **URL:** `localhost:3000`
- **Method:** `GET`
- **Description:** Returns the shortest flight route between two airports.
- **Request Body:**
  ```json
  {
    "start": "TLL", /* This the Source Airport Code */
    "end": "TAK" /* This the Destination Airport Code */
  }


- **Response:**

| First Header  | Second Header |
| ------------- | ------------- |
| shortestPath  | Contains the shortest route. Outputs array of airport codes  |
| shortestDistance  | Info on shortest distance caluclation in kilometers  |
| shortestPathView  | Contains URL to visualize the path from source to destination and suggested stops.   |
| allPathDist  | Contains all other alternative path information.  |


- **Response Example:**
  ```json
  {
  "shortestPath": [
    "TLL",
    "HLD",
    "TAK"
  ],
  "shortestDistance": "7764.459km",
  "shortestPathView": "https://www.greatcirclemap.com/?routes=TLL-HLD-TAK",
  "allPathDist": [
    {
      "path": [
        "TLL",
        "PEX",
        "EIE",
        "HLD",
        "TAK"
      ],
      "distance": "7821.555km",
      "view": "https://www.greatcirclemap.com/?routes=TLL-PEX-EIE-HLD-TAK"
    },
    {
      "path": [
        "TLL",
        "PEX",
        "HLD",
        "TAK"
      ],
      "distance": "7764.847km",
      "view": "https://www.greatcirclemap.com/?routes=TLL-PEX-HLD-TAK"
    },
    {
      "path": [
        "TLL",
        "EIE",
        "HLD",
        "TAK"
      ],
      "distance": "7801.967km",
      "view": "https://www.greatcirclemap.com/?routes=TLL-EIE-HLD-TAK"
    },
    {
      "path": [
        "TLL",
        "HLD",
        "TAK"
      ],
      "distance": "7764.459km",
      "view": "https://www.greatcirclemap.com/?routes=TLL-HLD-TAK"
    }
  ]
  }

### 2. Get Shortest Route with alternative Ground Hops
- **URL:** `localhost:3000/bonus`
- **Method:** `GET`
- **Description:** Returns the shortest flight route between two airports with possible ground hops.
- **Request Body:**
  ```json
  {
    "start": "TLL",
    "end": "TAK"
  }
- **Response:** Similar to the / endpoint but considers nearby airports.


