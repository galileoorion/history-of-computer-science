---
title: "How a Parking Lot Explains the Hash Table"
subtitle: "The 1950s IBM idea behind fast lookups, and why a crowded parking lot slows it down"
description: "The 1950s IBM idea behind fast lookups, and why a crowded parking lot slows it down"
sequence: 1
category: "Data structures"
historicalPeriod: "1953–1954"
author: "Attila Kulik"
pubDate: 2026-10-12
tags: ["Hash tables", "IBM", "Algorithms"]
---
A hash table helps a computer find an item without searching through an entire collection. Its early history leads to IBM in the 1950s, where programmers developed two different ways to handle a simple problem: what happens when two items are assigned the same storage position?

One of those methods is surprisingly easy to picture. Imagine a parking lot where a car’s license plate tells you where to start looking.

## What a hash table does

A **hash table**—often used to implement a hash map—stores items under **keys**, such as names or license plates. A **hash function** turns each key into a number, which determines a starting position in the table.

To find an item, the computer applies the same rule to its key and starts looking at that position. With a suitable hash function and enough spare capacity, lookups usually require only a few checks.

The arrangement has one built-in difficulty. Two different keys can produce the same position number. This is called a **collision**, and a hash table needs a rule for handling it.

Two common rules are **chaining** and **open addressing**.

## Who devised it

[Donald Knuth’s historical account](https://gwern.net/doc/cs/algorithm/information/compression/1998-knuth-taocp-v3-sortingandsearching-hashinghistory.pdf) traces hashing with chaining to an internal IBM memorandum written by Hans Peter Luhn in January 1953. Chaining lets each position refer to a list of items whose keys lead to that position.

Knuth also describes an IBM 701 assembler group involving Gene Amdahl, Elaine Boehme, Nathaniel Rochester, and Arthur Samuel. He credits Amdahl with the idea of open addressing using linear probing. An assembler translates human-readable instructions into machine code.

In his [*Notes on “Open” Addressing*](https://jeffe.cs.illinois.edu/teaching/datastructures/2011/notes/knuth-OALP.pdf), dated 1963, Knuth places the method’s first use in 1954. Under this policy, every item stays inside the table. If its starting position is occupied, the search continues through successive positions until a free one appears.

Arnold I. Dumey described hash-based indexing in print in December 1956, in [“Indexing for Rapid Random Access Memory Systems”](https://bitsavers.org/magazines/Computers_And_Automation/195612.pdf).

These early contributions explain why the history involves several names. The parking lot illustrates one particular method: **open addressing with linear probing**.

## Two ways to handle a collision

With **chaining**, each position points to a list. A lookup computes the position and searches that list.

If 10,000 items are distributed across 1,000 positions, the average list length is 10. With well-distributed keys, a lookup therefore searches a short list instead of the whole collection. A successful search may stop partway through; an unsuccessful one must check the entire selected list.

With **open addressing**, the items occupy the table’s positions directly. A collision sends the search to another position in the same table.

**Linear probing** uses the simplest sequence: try the next position, then the next, wrapping around at the end.

## The parking lot analogy

Imagine a parking lot with 100 spaces, numbered 00 to 99. Cars have unique numeric license plates, and the attendant follows the same rules every time.

### Parking a car

Your rule is to read the last two digits of the plate. A car with plate 4237 starts at space 37.

The license plate is the **key**. Taking its last two digits is the **hash function**. Space 37 is the starting position.

Now another car arrives with plate 8137. Its starting position is also 37, but that space is occupied. This is a collision.

You try space 38. If that is occupied, you try 39, and continue until you find an empty space. After space 99, you wrap around to 00.

That one-step-at-a-time search is linear probing. Keeping every car inside the numbered parking lot, rather than in an overflow area, illustrates open addressing.

Taking the last two digits makes the example easy to follow, but it is not automatically a good rule for real data. If many plates end in the same digits, collisions will be frequent.

### Finding a car

When the owner of plate 8137 returns, you apply the same rule and start at space 37.

The car there has the wrong plate, so you try space 38, then 39, until you find 8137. Checking the full plate matters: two cars can share a starting position without being the same car.

If you reach an empty space, you can stop. Provided departures are handled correctly, the car cannot be farther along this search path: it would have been parked in that earlier available space.

This proves the car is **not currently stored**, rather than proving it was never parked.

Usually the walk is short, but that is not guaranteed. In an extreme case, a search can inspect the whole table. It must stop after a complete circuit if it finds neither the car nor an empty space.

### Removing a car

A departing car creates a trap.

Suppose plate 4237 leaves space 37. If you simply mark that space empty, a later search for 8137 stops there—even though 8137 is still in space 38.

One remedy is to place a cone in space 37 marked “was occupied—keep looking.” In computing, this marker is called a **tombstone**.

A search walks past the cone. A new car may reuse the space.

In a hash map, there is an extra detail: before inserting a key into a tombstone position, the computer must check that the same key does not already exist farther along the search path. Otherwise, it could accidentally store the key twice.

Cones preserve correct searches, but a parking lot containing many cones can still require long walks. Tables using tombstones are commonly [rebuilt periodically to clear them](https://arxiv.org/abs/2107.01250).

### When the parking lot fills up

The share of spaces occupied by cars is called the **load factor**, usually written α, the Greek letter alpha.

With 80 cars in 100 spaces:

**α = 80 ÷ 100 = 0.8**

As the parking lot fills, occupied spaces form longer runs. A new car whose starting position falls inside a run must continue to its end. Filling the gap between two runs joins them into an even longer one. This is **primary clustering**.

Finding a car and confirming its absence have different costs. A successful search stops at the car. An unsuccessful search continues to an empty space.

For ordinary linear probing, the following [formulas give approximate average numbers of spaces checked](https://algs4.cs.princeton.edu/34hash/). They assume independently and uniformly distributed starting positions, a large table, and a table built by insertions without accumulated tombstones. For successful searches, each stored key is equally likely to be requested.

They illustrate the trend; they are not exact predictions for every arrangement of cars in a 100-space parking lot.

| Load factor | Finding a car that is there | Confirming a car is absent |
|---|---:|---:|
| Approximate average | ½ × (1 + 1 / (1 − α)) | ½ × (1 + 1 / (1 − α)²) |
| Half full: α = 0.5 | 1.5 spaces | 2.5 spaces |
| 80% full: α = 0.8 | 3 spaces | 13 spaces |
| 90% full: α = 0.9 | 5.5 spaces | 50.5 spaces |

For an unsuccessful search at 80% full, the calculation is:

**½ × (1 + 1 / 0.2²) = ½ × (1 + 25) = 13**

Going from half full to 80% full raises this estimate from 2.5 checks to 13—more than five times as many.

The parking lot still has empty spaces. The difficulty is reaching one.

### Moving to a bigger parking lot

A common response is **resizing**: allocate a larger table and insert the existing items again.

Imagine moving the 80 cars into a lot with 200 spaces, numbered 000 to 199. The old last-two-digits rule would use only half the possible starting positions, so it needs adjusting.

For this example, divide the plate number by 200 and use the remainder:

- Plate 4237 starts at space 037.
- Plate 8137 starts at space 137.

The two cars that previously collided now have different starting positions.

Every car must be processed again under the new rule, although some starting positions will remain the same. Rebuilding also clears the old tombstones.

The load factor falls to:

**α = 80 ÷ 200 = 0.4**

Under the same assumptions as the table above, the approximate averages become 1.33 checks for a successful search and 1.89 for an unsuccessful one.

The move takes work, but it restores the spare capacity that makes lookups fast.

A hash table gets its speed from a repeatable starting rule, a reliable way to handle collisions, and enough room to keep searches short.

## Sources

- **Donald E. Knuth**, *The Art of Computer Programming*, Volume 3: *Sorting and Searching*, second edition (1998), §6.4, pp. 547–549. The [historical account of hashing](https://gwern.net/doc/cs/algorithm/information/compression/1998-knuth-taocp-v3-sortingandsearching-hashinghistory.pdf) supports the discussion of Luhn and the IBM assembler group. Luhn’s original memorandum was not consulted directly.
- **Donald E. Knuth**, [*Notes on “Open” Addressing*](https://jeffe.cs.illinois.edu/teaching/datastructures/2011/notes/knuth-OALP.pdf) (1963). An early mathematical analysis of linear probing, including its use in 1954.
- **Arnold I. Dumey**, “Indexing for Rapid Random Access Memory Systems,” [*Computers and Automation*, December 1956](https://bitsavers.org/magazines/Computers_And_Automation/195612.pdf), pp. 6–9. An early published description of hash-based indexing.
- **Robert Sedgewick and Kevin Wayne**, [*Algorithms*, §3.4: Hash Tables](https://algs4.cs.princeton.edu/34hash/). Explains chaining, linear probing, and the approximate search-cost formulas used in the table.
- **Michael A. Bender, Bradley C. Kuszmaul, and William Kuszmaul**, [*Linear Probing Revisited: Tombstones Mark the Death of Primary Clustering*](https://arxiv.org/abs/2107.01250) (2021). Discusses deletion markers, rebuilding, and how implementation choices affect clustering.
