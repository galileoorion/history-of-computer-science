---
title: "How a Road Atlas Explains Dijkstra's Algorithm"
subtitle: "A seven-town route shows how the 1956 algorithm works\u2014and why a negative cost can defeat it"
description: "A seven-town Dutch road atlas explains Dijkstra\u2019s shortest-path algorithm, its 1956 origin, and why negative costs can break it."
sequence: 2
category: "Algorithms"
listingImage: "/images/dijkstra-atlas-map.svg"
listingImageAlt: "Seven-town Dutch road atlas showing the routes used in the Dijkstra example"
historicalPeriod: "1956–1959"
author: "Attila Kulik"
tags: ["Dijkstra", "Shortest paths", "Graph algorithms"]
pubDate: 2026-10-13
draft: false
---

Dijkstra's algorithm finds the shortest routes from a starting town by keeping track of the best distance found to each town. It repeatedly chooses the smallest distance that is still provisional, makes it final, then checks whether roads from that town offer shorter routes to others. Edsger W. Dijkstra devised the method in 1956. The seven-town atlas below lets you try it by hand.

## What Dijkstra's algorithm does

A **graph** is a set of points, called **nodes**, and connections between them, called **edges**. On a road map, towns are nodes and roads are edges. Each edge has a **weight**, such as kilometres, minutes or euros. The **shortest-path problem** asks which route from a starting node to a destination has the smallest total weight. Dijkstra's algorithm finds the shortest distance to every reachable node, although you can stop once it settles a particular destination.

The algorithm records a **tentative distance** for each node: the shortest route found to it so far. The starting node begins at 0; all others begin at infinity, meaning no route is known yet. It chooses the node with the smallest tentative distance that has not been **settled**, or made final. Then it checks roads from that node. If one offers a shorter route to a neighbour, it updates the neighbour's distance. This check is called **relaxation**. A settled distance is never revised, so the usual algorithm is guaranteed to work when all weights are zero or greater.

## Who devised it

Dijkstra's surname is pronounced roughly “DIKE-strah” in Dutch ([hear a native speaker](https://commons.wikimedia.org/wiki/File:Dijkstra.ogg)). He worked out the method in 1956 as a programmer at Amsterdam's Mathematical Centre. For the inauguration of its ARMAC computer, he wanted a demonstration a general audience could understand. In a [2001 interview](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), he recalled choosing 64 Dutch cities, each identifiable with six bits (2⁶ = 64), and devising the method in about twenty minutes, without pencil and paper, at an Amsterdam café with his fiancée.

His accounts differ on the demonstration's details. The 2001 interview uses Rotterdam to Groningen as an example. A [1982 recollection](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf) describes a railway map, gives Harlingen to Maastricht as the example, and links the café scene to his *other* graph algorithm. The road atlas below is a new teaching example, not a reconstruction of the demonstration.

Dijkstra published the method in [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390) in 1959. The paper's other problem was finding a **minimum spanning tree**: connecting all nodes with the smallest total edge weight, rather than finding the shortest route between two nodes. Vojtěch Jarník described that method in 1930; [Robert Prim published it in 1957](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/). Lester Ford described a related shortest-path method in [1956](https://www.rand.org/pubs/papers/P923.html), and Richard Bellman published [one in 1958](https://doi.org/10.1090/qam/102435). **Bellman–Ford** can handle negative edge weights unless a reachable negative cycle makes a shortest distance undefined. Its repeated checks of the edges generally take more work than Dijkstra's method.

## Worked example: Rotterdam to Groningen

Imagine planning a delivery on a small atlas showing Rotterdam, Amsterdam, Utrecht, Amersfoort, Arnhem, Zwolle and Groningen. The ten two-way roads below form our graph; each has a length in kilometres.

| Road | Length |
|---|---:|
| Rotterdam–Amsterdam | 79 km |
| Rotterdam–Utrecht | 62 km |
| Utrecht–Amersfoort | 27 km |
| Utrecht–Arnhem | 65 km |
| Amsterdam–Amersfoort | 52 km |
| Amsterdam–Zwolle | 105 km |
| Amsterdam–Groningen | 183 km |
| Amersfoort–Zwolle | 69 km |
| Arnhem–Zwolle | 67 km |
| Zwolle–Groningen | 106 km |

![Map of the Netherlands showing Rotterdam, Amsterdam, Utrecht, Amersfoort, Arnhem, Zwolle and Groningen joined by ten roads, each labelled with its length in kilometres.](/images/dijkstra-atlas-map.svg)

The figures are driving distances between city centres from [OSRM](https://project-osrm.org/docs/v5.24.0/api/) and [OpenStreetMap](https://www.openstreetmap.org/copyright). Each averages the two directions and is rounded to the nearest kilometre. OSRM chooses its *fastest* route, so the distances depend on the chosen centre points and map data. Recent Amsterdam–Groningen routes used the A6 and A7; Amsterdam–Zwolle routes used the A6 and N307, among other roads. The A6 passes Almere on land that [did not dry out until 1968](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon). These are modern distances, not Dijkstra's 1956 figures; the map draws approximate paths.

Put a sticky note on each town. Write 0 in pencil on Rotterdam and ∞ on the others. Beside each distance, write the town the best route came from; this is its **predecessor**. At each step, circle the smallest uncircled number in pen. Then add the lengths of the roads from that town to uncircled neighbours. Replace a neighbour's pencilled distance and “came from” town whenever you find a shorter route. A circled number is final.

The figures show all seven steps. Filled red dots mark circled towns; dashed dots have pencilled numbers. A red ring marks the town circled in that step, struck-through numbers show replacements, and red roads show the current “came from” links. The final links form a **shortest-path tree** from Rotterdam.

**1. Rotterdam (0)** gives Amsterdam 0 + 79 = 79 and Utrecht 0 + 62 = 62.

![Step 1: Rotterdam is circled at 0. Amsterdam gets 79 and Utrecht gets 62, both via Rotterdam.](/images/dijkstra-atlas-step-1.svg)

**2. Utrecht (62)** gives Amersfoort 62 + 27 = 89 and Arnhem 62 + 65 = 127. The road back to settled Rotterdam is skipped.

![Step 2: Utrecht is circled at 62. Amersfoort gets 89 and Arnhem gets 127, both via Utrecht.](/images/dijkstra-atlas-step-2.svg)

**3. Amsterdam (79)** offers Amersfoort 79 + 52 = 131, so its 89 stays. It gives Zwolle 79 + 105 = 184 and Groningen 79 + 183 = 262. Groningen's number remains provisional.

![Step 3: Amsterdam is circled at 79. Zwolle gets 184 and Groningen gets 262, both via Amsterdam; Amersfoort keeps 89 because 131 is longer.](/images/dijkstra-atlas-step-3.svg)

**4. Amersfoort (89)** offers Zwolle 89 + 69 = 158. Replace its 184 with 158 via Amersfoort: this is why the notes are in pencil.

![Step 4: Amersfoort is circled at 89. Zwolle's note changes from 184 via Amsterdam to 158 via Amersfoort.](/images/dijkstra-atlas-step-4.svg)

**5. Arnhem (127)** offers Zwolle 127 + 67 = 194, so Zwolle keeps 158.

![Step 5: Arnhem is circled at 127. Zwolle keeps 158 because 194 is longer.](/images/dijkstra-atlas-step-5.svg)

**6. Zwolle (158)** offers Groningen 158 + 106 = 264, which loses to its current 262 by 2 km.

![Step 6: Zwolle is circled at 158. Groningen keeps 262 via Amsterdam because 264 is longer.](/images/dijkstra-atlas-step-6.svg)

**7. Groningen (262)** is the last town to be circled.

![Step 7: Groningen is circled at 262 via Amsterdam, and every town is circled.](/images/dijkstra-atlas-step-7.svg)

Follow the “came from” notes backwards: Groningen came from Amsterdam, which came from Rotterdam. The shortest route in this graph is Rotterdam → Amsterdam → Groningen, at 79 + 183 = 262 km. The alternative through Utrecht, Amersfoort and Zwolle is 62 + 27 + 69 + 106 = 264 km.

That 2 km margin comes from rounding each road separately. Before rounding, the original OSRM calculation put the routes at 262.7 km and 262.8 km, nearly a tie. A [direct OSRM route](https://router.project-osrm.org/route/v1/driving/4.4777,51.9244;6.5665,53.2194?overview=false) is about 248 km because it uses roads omitted from this small graph. The algorithm finds the shortest route among the roads you give it, not every road in the Netherlands.

### Why a circled number is final

When you circle Amersfoort at 89, every other uncircled town has a pencilled distance of at least 89. Any new route to Amersfoort must pass through one of those towns. Since each remaining road adds zero or more kilometres, it cannot improve on 89. This is why you may stop as soon as you circle your destination. A delivery to Amersfoort, for instance, needs only the first four steps.

### Why a negative road breaks it

Now treat each kilometre as costing one euro. Suppose a courier firm pays you €72 to go from Amersfoort to Amsterdam. That 52 km journey has a net cost of €52 − €72 = −€20; the reverse direction still costs €52. Amsterdam was circled at €79 in step 3, but Amersfoort's link in step 4 offers a route to it costing €89 − €20 = €69. The algorithm cannot revise Amsterdam's circled number.

![A one-way road from Amersfoort to Amsterdam costs −20. Amsterdam is already circled at 79, but Amersfoort, circled at 89, offers 89 − 20 = 69.](/images/dijkstra-atlas-negative-road.svg)

It has also used €79 to calculate Groningen's €262. The true cheapest cost is €69 + €183 = €252, but Dijkstra's routine still returns €262. Bellman–Ford can revise earlier estimates and finds €252 here.

The €72 payment is below €104 deliberately. The Amsterdam–Amersfoort–Amsterdam round trip costs €52 + (€52 − the payment). Above €104, this would be a **negative cycle**: repeating it would lower the cost without limit, leaving no cheapest route to Groningen. Bellman–Ford can detect such a cycle; the usual Dijkstra procedure cannot handle one.

### How the work grows with the map

Finding the next town by scanning every uncircled note takes work that grows roughly as *n*² for *n* towns. Checking the roads adds work proportional to *m*, the number of roads. A **priority queue** avoids a full scan: imagine arranging the notes so the smallest is easy to take. A **binary heap** takes about log₂ *n* operations to choose the next town or update a note, giving a bound of (*n* + *m*) log *n*. Fredman and Tarjan's [Fibonacci heap](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf), presented in 1984 and published in 1987, improves the theoretical bound to *m* + *n* log *n*.

The table compares rough *units of work*, not elapsed time. The larger examples assume *m* = 3*n*.

| Map | Towns (*n*) | Roads (*m*) | Scan: *n*² | Binary heap: (*n* + *m*) log₂ *n* |
|---|---:|---:|---:|---:|
| Seven-town atlas | 7 | 10 | 49 | about 48 |
| Regional map | 1,000 | 3,000 | 1,000,000 | about 40,000 |
| Large road network | 1,000,000 | 3,000,000 | 1,000,000,000,000 | about 80,000,000 |

For a million towns, log₂ *n* is about 20, so the heap formula gives about 80 million units against a trillion for scanning. This does not predict a 12,500-fold speedup: operations have different costs, and memory use and graph structure also matter. The heap helps most on a **sparse** graph with far fewer than *n*² roads, as road networks usually have. Link-state routing protocols such as [OSPF](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS](https://www.rfc-editor.org/rfc/rfc1195.html) use shortest-path-first calculations based on Dijkstra's method.

## Sources

- Philip L. Frana, [*An Interview with Edsger W. Dijkstra*](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), oral history, 2001; source for the 64 cities, Rotterdam–Groningen example and café account.
- Dijkstra's [1982 recollection](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf), published in 1983; source for the railway map, Harlingen–Maastricht example and differing café account.
- Dijkstra, [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390), *Numerische Mathematik* 1 (1959): 269–271.
- Prim, [“Shortest Connection Networks And Some Generalizations”](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/) (1957); [NIST on Jarník's contribution](https://xlinux.nist.gov/dads/HTML/primJarnik.html) (1930).
- Ford, [*Network Flow Theory*](https://www.rand.org/pubs/papers/P923.html) (1956); Bellman, [“On a routing problem”](https://doi.org/10.1090/qam/102435) (1958); Fredman and Tarjan, [“Fibonacci heaps and their uses in improved network optimization algorithms”](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf) (1987).
- [OSPF RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS RFC 1195](https://www.rfc-editor.org/rfc/rfc1195.html), for routing applications.
- [OSRM](https://project-osrm.org/docs/v5.24.0/api/) with [OpenStreetMap data](https://www.openstreetmap.org/copyright), © OpenStreetMap contributors, for road figures. A fresh check on 13 October 2026 put each link within about 2 km of its displayed value; the original inputs for the 262.7 km and 262.8 km totals were not retained. The direct route linked above returned 247.7 km. Routing results can change with inputs and map updates. [Almere City Archives](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon) dates the drying of southern Flevoland to 1968.
- [Natural Earth](https://www.naturalearthdata.com/) 1:10m country and lake outlines, public domain, for the background map.
