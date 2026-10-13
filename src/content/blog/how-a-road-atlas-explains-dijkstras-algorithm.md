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

Starting at one town, Dijkstra's algorithm records the shortest distance found so far to every other town. Each time, it chooses the smallest distance that has not yet been confirmed and makes it final. It then checks whether roads from that town offer shorter routes to its neighbours. This works when no road has a negative cost. Edsger W. Dijkstra devised the method in 1956 for a computer demonstration. The seven-town atlas below lets you try it by hand.

## What Dijkstra's algorithm does

Dijkstra's algorithm finds the shortest route through a **graph**: a set of points and connections, rather than a chart of data. The points are called **nodes**, and the connections are called **edges**. Each edge has a **weight**, such as a distance in kilometres, a travel time in minutes or a cost in euros. On a road map, towns are nodes and roads are edges. Starting from one town, the algorithm can find the shortest distance to every town it can reach. If you need only one destination, you can stop as soon as its distance is final.

The algorithm records a **tentative distance** for each node: the length of the shortest route found to it so far. The starting node begins at 0. Every other node begins at infinity, which means no route to it is known yet.

The algorithm then repeats a routine. It selects the node with the smallest tentative distance that has not already been settled. It **settles** that node, making its distance final, and checks each edge leading from it. If a route through the settled node is shorter than the route currently recorded for a neighbouring node, the algorithm updates that neighbour's distance. This comparison and possible update is called **relaxation**.

This routine gives the correct answer when every edge has a weight of zero or more. It never revises a settled distance. A negative edge can therefore reveal a shorter route after the algorithm has already marked a distance as final. The example below shows how that happens.

## Who devised it

Dijkstra devised the shortest-path method in 1956 while working as a programmer at the Mathematical Centre in Amsterdam. He wanted a demonstration for the inauguration of its ARMAC computer that a general audience could understand. In a [2001 oral-history interview](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), he said he chose 64 Dutch cities for a simplified map. Each city could be identified with six bits, because 2⁶ = 64. He recalled working out the method in about twenty minutes, without pencil and paper, while resting at an Amsterdam café with his fiancée.

In that interview, Dijkstra gave Rotterdam to Groningen as an example of the route-finding question. In a [1982 recollection](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf), however, he described a railway map and gave Harlingen to Maastricht as the example. He also linked the café scene to his *other* graph algorithm. His accounts differ on these details. The road atlas in this article is a teaching example, not a reconstruction of the ARMAC demonstration.

The method appeared in print in 1959, in Dijkstra's three-page paper [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390). The other problem in the paper was finding a **minimum spanning tree**: a set of links that connects all the nodes with the smallest possible total weight. That is a different goal from finding the shortest route between two nodes. Vojtěch Jarník had described the spanning-tree method in 1930, and [Robert Prim published it in 1957](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/).

At each stage, Dijkstra's published procedure chooses the node with the smallest tentative distance. A straightforward implementation finds it by scanning all the remaining nodes. With *n* nodes, the work spent on those scans grows roughly as *n*². That is a growth rate, not a count of the ARMAC's instructions or a measure of its running time.

Shortest-path research was not confined to Dijkstra. Lester Ford described a related method in a [1956 report](https://www.rand.org/pubs/papers/P923.html), and Richard Bellman published [“On a routing problem” in 1958](https://doi.org/10.1090/qam/102435). The method now called **Bellman–Ford** can handle negative edge weights if no reachable negative cycle makes the shortest distance undefined. Its repeated passes over the edges generally cost more than Dijkstra's greedy choice.

Later implementations used a **priority queue** to find the next node more efficiently. A **binary heap**, for example, gives a running-time bound of about (*n* + *m*) log *n*, where *n* is the number of nodes and *m* is the number of edges. Michael Fredman and Robert Tarjan's [Fibonacci heap](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf), presented in 1984 and published in 1987, improves the theoretical bound to *m* + *n* log *n*. Network routing protocols such as [OSPF](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS](https://www.rfc-editor.org/rfc/rfc1195.html) use shortest-path calculations based on Dijkstra's method.

## Worked example: Rotterdam to Groningen

You can work through Dijkstra's algorithm with a paper road atlas, a pencil, sticky notes and a pen. This example uses seven Dutch towns and distances from a modern routing service. It includes only ten roads. Those roads, rather than the full Dutch road network, make up the graph for this exercise.

### Setting up the atlas

Imagine planning a delivery from Rotterdam to Groningen, the pair of cities Dijkstra later used to explain the problem. Your small atlas shows Rotterdam, Amsterdam, Utrecht, Amersfoort, Arnhem, Zwolle and Groningen. Each town is a node. Each road is an edge labelled with its length in kilometres. The atlas has these ten two-way roads:

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

The figures come from the [OSRM routing service](https://project-osrm.org/docs/v5.24.0/api/), which uses [OpenStreetMap](https://www.openstreetmap.org/copyright) data. For each pair of city centres, the figure averages the driving distance in both directions and rounds it to the nearest kilometre. OSRM chooses its *fastest* route between the points, so the distance can change with the chosen centre points, map data or routing settings. A recent check sent Amsterdam–Groningen along the A6 and A7, and Amsterdam–Zwolle along the A6 and N307, among other roads. The A6 passes Almere on land that [did not dry out until 1968](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon). These are modern distances, not figures from Dijkstra's 1956 demonstration. The map shows approximate paths rather than exact driving routes.

Put a sticky note on each town. Write 0 in pencil on Rotterdam's note, because that is where you start. Write ∞ on every other note, because you do not yet know a route to those towns. Each pencilled number is a tentative distance. Later, you will circle numbers in pen as they become final. A town with a circled number is **settled**, and you never change its number again.

Beside each distance, also write the town you came from on the best route found so far. At the end, you can follow these “came from” notes backwards to trace the route itself.

### Circling the nearest town

At each step, look at the uncircled towns and circle the smallest pencilled number. Then check each road from that town to an uncircled neighbour. Add the road's length to the number you just circled. If the sum is smaller than the neighbour's pencilled number, erase that number and write the new sum. Also update its “came from” note. This comparison and possible change is relaxation.

There are seven steps, one for each town. The figures below show each step. A filled red dot marks a town with a circled number; a dashed dot marks one whose number is still in pencil. A red ring shows which town was circled in that step, and a struck-through number shows a distance that has just been replaced. Red roads show the current “came from” links. A link to an uncircled town may still change. At the end, these links form a **shortest-path tree** from Rotterdam: they show the shortest route to each town.

In step 1, Rotterdam has the smallest note, 0, so you circle it. Its two roads give Amsterdam a note of 0 + 79 = 79 and Utrecht a note of 0 + 62 = 62, both via Rotterdam.

![Step 1: Rotterdam is circled at 0. Amsterdam gets 79 and Utrecht gets 62, both via Rotterdam.](/images/dijkstra-atlas-step-1.svg)

In step 2, Utrecht has the smallest uncircled number, 62, so you circle it. Utrecht's roads give Amersfoort a distance of 62 + 27 = 89 and Arnhem a distance of 62 + 65 = 127. You skip the road back to Rotterdam because Rotterdam is already settled.

![Step 2: Utrecht is circled at 62. Amersfoort gets 89 and Arnhem gets 127, both via Utrecht.](/images/dijkstra-atlas-step-2.svg)

In step 3, you circle Amsterdam at 79. A route through Amsterdam would put Amersfoort at 79 + 52 = 131, longer than its current 89, so you leave that note alone. Amsterdam's other roads give Zwolle 79 + 105 = 184 and Groningen 79 + 183 = 262. Groningen now has a possible route, but its number stays in pencil. A shorter route might still turn up.

![Step 3: Amsterdam is circled at 79. Zwolle gets 184 and Groningen gets 262, both via Amsterdam; Amersfoort keeps 89 because 131 is longer.](/images/dijkstra-atlas-step-3.svg)

In step 4, you circle Amersfoort at 89. Its road to Zwolle offers a distance of 89 + 69 = 158. That beats Zwolle's current 184, so you erase 184 and write 158 via Amersfoort. This is the first time you replace a distance you had already written down. It shows why the notes are in pencil.

![Step 4: Amersfoort is circled at 89. Zwolle's note changes from 184 via Amsterdam to 158 via Amersfoort.](/images/dijkstra-atlas-step-4.svg)

In step 5, you circle Arnhem at 127. Its only unsettled neighbour is Zwolle. The route through Arnhem would reach Zwolle in 127 + 67 = 194 km, longer than its current 158, so nothing changes.

![Step 5: Arnhem is circled at 127. Zwolle keeps 158 because 194 is longer.](/images/dijkstra-atlas-step-5.svg)

In step 6, you circle Zwolle at 158. The road to Groningen offers a route of 158 + 106 = 264 km. That is 2 km longer than the 262 km route via Amsterdam, so Groningen's note stays as it is.

![Step 6: Zwolle is circled at 158. Groningen keeps 262 via Amsterdam because 264 is longer.](/images/dijkstra-atlas-step-6.svg)

In step 7, only Groningen remains uncircled. Circle its 262, and every town has a final distance.

![Step 7: Groningen is circled at 262 via Amsterdam, and every town is circled.](/images/dijkstra-atlas-step-7.svg)

The table below records the seven steps in one place.

| Step | Town circled | Circled distance | Notes rewritten | Offers rejected |
|---|---|---|---|---|
| 1 | Rotterdam | 0 | Amsterdam 0 + 79 = 79, Utrecht 0 + 62 = 62 | none |
| 2 | Utrecht | 62 | Amersfoort 62 + 27 = 89, Arnhem 62 + 65 = 127 | none |
| 3 | Amsterdam | 79 | Zwolle 79 + 105 = 184, Groningen 79 + 183 = 262 | Amersfoort 131 (keeps 89) |
| 4 | Amersfoort | 89 | Zwolle 89 + 69 = 158 (was 184) | none |
| 5 | Arnhem | 127 | none | Zwolle 194 (keeps 158) |
| 6 | Zwolle | 158 | none | Groningen 264 (keeps 262) |
| 7 | Groningen | 262 | none | none |

To recover the route, follow the “came from” notes backwards: Groningen came from Amsterdam, and Amsterdam came from Rotterdam. Reverse that order to get Rotterdam → Amsterdam → Groningen. Its length is 79 + 183 = 262 km, matching Groningen's circled number. The alternative through Utrecht, Amersfoort and Zwolle is 62 + 27 + 69 + 106 = 264 km. The algorithm rejected it in step 6 because it is 2 km longer.

That 2 km difference comes from rounding each road separately. Before rounding, the two routes in the original OSRM calculation measured 262.7 km and 262.8 km—almost a tie. A new query may give different results as the map data or chosen city-centre points change. A [direct OSRM route between representative centre points](https://router.project-osrm.org/route/v1/driving/4.4777,51.9244;6.5665,53.2194?overview=false) is about 248 km because it can use roads left out of the seven-town atlas. Dijkstra's algorithm finds the shortest route in the graph you give it, not necessarily the shortest route on the full road network.

### Why a circled number is final

Why can you trust a circled number? Consider step 4, when you circle Amersfoort at 89. Rotterdam, Utrecht and Amsterdam are already settled. Any other route to Amersfoort must first pass from a settled town to one that is still uncircled. That uncircled town's pencilled distance is at least 89, because you chose Amersfoort as the smallest. Every road after it adds zero or more kilometres. So the alternative cannot reach Amersfoort in less than 89 km.

This is why the towns are settled in order of their shortest distance from Rotterdam: 0, 62, 79, 89, 127, 158 and 262 km on this atlas. You can therefore stop when you circle your destination. If you were delivering to Amersfoort, you could stop after step 4; there would be no need to settle Arnhem, Zwolle or Groningen.

### Why a negative road breaks it

The argument breaks down if an edge has a negative **cost**. A road can then lower the total, even after the route has reached a more expensive town. To see this, treat each kilometre in the atlas as costing one euro. Now suppose a courier firm pays you €72 to carry a parcel from Amersfoort to Amsterdam. That 52 km journey has a net cost of €52 − €72 = −€20. Travelling the other way still costs €52, so the two directions have different weights. The routine circles Amsterdam at €79 in step 3. But in step 4, the route through Amersfoort offers a cost of €89 − €20 = €69 to Amsterdam—less than its already circled €79.

![A one-way road from Amersfoort to Amsterdam costs −20. Amsterdam is already circled at 79, but Amersfoort, circled at 89, offers 89 − 20 = 69.](/images/dijkstra-atlas-negative-road.svg)

The algorithm cannot erase Amsterdam's circle. It has already used €79 in step 3 to work out the routes to Zwolle and Groningen. The cheapest route to Groningen now costs €69 + €183 = €252, but the routine still circles Groningen at €262—€10 too high. Bellman–Ford repeatedly checks all directed links and can revise earlier estimates. On this graph, it finds €252.

The €72 payment is below €104 for a reason. A round trip from Amsterdam to Amersfoort and back costs €52 + (€52 − the payment). If the payment exceeded €104, that loop would have a negative total cost. It would be a **negative cycle**: you could repeat the loop to lower the cost without limit, so there would be no cheapest route to Groningen. Bellman–Ford can detect a reachable negative cycle; the usual Dijkstra procedure cannot handle one.

### How the work grows with the map

How much work the algorithm takes depends partly on how you choose the next town. You could scan every uncircled note each time. For *n* towns, that means scanning *n*, then *n* − 1, then *n* − 2 notes, and so on. The total grows roughly as *n*². You also have to examine the roads, adding work proportional to *m*, the number of roads.

A **priority queue** offers another way to choose the next town. Imagine a rack of notes arranged so you can take the smallest one without searching the whole pile. A **binary heap** is one way to organise that rack. Taking the smallest note or updating a note takes about log₂ *n* operations at most. Across *n* towns and *m* roads, the worst-case work grows as (*n* + *m*) log *n*.

The table compares these growth formulas at three map sizes. The figures are rough *units of work*, not measured instructions or predicted running times. In the larger two examples, *m* = 3*n*: there are three times as many roads as towns.

| Map | Towns (*n*) | Roads (*m*) | Scan: *n*² | Binary heap: (*n* + *m*) log₂ *n* |
|---|---:|---:|---:|---:|
| Seven-town atlas | 7 | 10 | 49 | about 48 |
| Regional map | 1,000 | 3,000 | 1,000,000 | about 40,000 |
| Large road network | 1,000,000 | 3,000,000 | 1,000,000,000,000 | about 80,000,000 |

For the million-town map, log₂ 1,000,000 is about 20 because 2²⁰ = 1,048,576. The heap formula gives roughly (1,000,000 + 3,000,000) × 20 = 80,000,000 units of work. The scan formula gives 1,000,000² = 1,000,000,000,000. Avoiding a full scan matters greatly on a large map with relatively few roads. These figures do not mean the heap version will run exactly 12,500 times faster. The operations have different costs, and actual speed also depends on memory use and the shape of the graph.

This advantage is greatest when the graph is **sparse**: it has far fewer roads than the *n*² possible connections. If nearly every town connects directly to every other town, the algorithm must inspect so many roads that scanning for the next town can be competitive. Road networks are usually sparse, so a priority queue is often useful.

## Sources

- Philip L. Frana, [*An Interview with Edsger W. Dijkstra*](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), Charles Babbage Institute oral history, 2 August 2001; an edited version appeared in *Communications of the ACM* 53, no. 8 (2010): 41–47. Source for the 64 cities, six-bit coding, Rotterdam–Groningen example and café account.
- Edsger W. Dijkstra, [1982 recollection of the ARMAC demonstration](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf), published in *Current Contents* in 1983. Describes a railway map and a Harlingen–Maastricht example.
- Edsger W. Dijkstra, [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390), *Numerische Mathematik* 1 (1959): 269–271.
- Robert C. Prim, [“Shortest Connection Networks And Some Generalizations”](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/), *Bell System Technical Journal* 36 (1957): 1389–1401; [NIST's account of Jarník's 1930 contribution](https://xlinux.nist.gov/dads/HTML/primJarnik.html).
- Lester R. Ford Jr., [*Network Flow Theory*](https://www.rand.org/pubs/papers/P923.html), RAND paper P-923 (1956); Richard Bellman, [“On a routing problem”](https://doi.org/10.1090/qam/102435), *Quarterly of Applied Mathematics* 16 (1958): 87–90.
- Michael L. Fredman and Robert E. Tarjan, [“Fibonacci heaps and their uses in improved network optimization algorithms”](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf), *Journal of the ACM* 34, no. 3 (1987): 596–615.
- [OSPF RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS RFC 1195](https://www.rfc-editor.org/rfc/rfc1195.html), for routing applications.
- [OSRM routing API](https://project-osrm.org/docs/v5.24.0/api/) using [OpenStreetMap data](https://www.openstreetmap.org/copyright), © OpenStreetMap contributors, for the road figures and named road segments. A fresh check on 13 October 2026 using representative city-centre points was within about 2 km of each displayed link; the original input coordinates for the 262.7 km and 262.8 km unrounded totals were not retained. The direct Rotterdam–Groningen query linked above returned 247.7 km. Routing results are sensitive to inputs and map updates. [Almere City Archives](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon) dates the drying of southern Flevoland to 1968.
- [Natural Earth](https://www.naturalearthdata.com/) 1:10m country and lake outlines, public domain, credited for the background map figures.
