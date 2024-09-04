# Finding Shortest Flight Path API

This API helps you find the shortest route between two airports using their IATA or ICAO codes. As a bonus, it also gives you alternative paths and also helps to find where you can do ground hops within 100kms distance.

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
  
   | Field name  | Description |
   | ------------- | ------------- |
   | start  | This is the Source Airport Code.  |
   | end  | This is the Destination Airport Code.  |

- **Request Body Example:**
  ```json
  {
    "start": "TLL", 
    "end": "TAK" 
  }


- **Response:**

| Field name  | Description |
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

### 2. BONUS - Get Shortest Route with alternative Ground Hops
- **URL:** `localhost:3000/bonus`
- **Method:** `GET`
- **Description:** Returns the shortest flight route between two airports with possible ground hops.
- **Note:** This endpoint is just to know if ground hops are possible, it still finds the shortest path which can be without ground hops too.
- **Request Body:**
  ```json
  {
    "start": "TLL",
    "end": "TAK"
  }
- **Response:** Similar to the / endpoint but considers nearby airports.


## Logic used
I have used simple maths to find the shortest possible path from point A to point B. The shortest distance would be a straight line from A to B.
If a straight line path is not possible we have to take a path that is as near as possible to the straight line (A to B). 
This same logic I am using in this API. Suppose we have to go from Airport A to B as shown below. Then at first I am finding the center of point A to point B, i.e.P1.
Then I am finding center of A and P1 which is P2, same way I find P3. 
Now we have P1, P2 and P3 are points on the straight line, (please note by straight line here we also consider the spherical direct line)
I am using these points P1, P2 and P3 as a reference to find the nearest airports possible on the way from A to B say Airports X, Y and Z as shown in below image, and then I am  creating all possible paths using these nearest airports and then finding a shortest possible path.
For the Bonus part, I am additionally trying to find if there are any nearest airports from airports X, Y and Z within 100 km. IF there are then I am considering these stops 
to find the shortest path.
![image](https://github.com/user-attachments/assets/ab65bfb2-eb4c-4f32-b917-88cdf42ffc67)


## Optimizations possible
Further optimization is possible by doing the below points.
1. Right now I have a list of around 4000 airports where I am doing the lookup, it would be great we can categories the airports based on region such as EU, Asia, America etc and then loop throguh as per region, instead of looping through all airports unnecessarily.
2. As mentioned above in Logic used section, I am using three referral points P1, P2, and P3 to find the shortest path if we have more points in addition to the above optimization, then we will be able to search for more optimized shortest path possible.
   
