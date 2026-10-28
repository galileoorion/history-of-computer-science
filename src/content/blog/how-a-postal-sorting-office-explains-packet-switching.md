---
title: "How a Postal Sorting Office Explains Packet Switching"
subtitle: "Why messages travel in pieces across shared links and can arrive out of order"
description: "See how two senders share one link, how three pieces of a message take two routes, and how TCP restores byte order."
sequence: 18
category: "Networking"
historicalPeriod: "1964–1970"
author: "Attila Kulik"
tags: ["Packet switching", "Computer networks", "Internet", "TCP", "Computing history"]
heroImage: "/images/postal-sorting-office-packet-switching-feature.jpg"
heroImageAlt: "A postal worker sorts cream-coloured envelopes into canvas mailbags in a sunlit sorting office"
pubDate: 2026-10-28
draft: false
---

Imagine sending a long letter as several short cards. You number the cards, put each in its own envelope and write the same destination on every envelope. At a sorting office, your envelopes join other people's mail: the office need not reserve an entire mailbag or route for your letter. One card might leave by the northern route and another by the southern route. The recipient could receive them out of order and still put the letter back together.

That is the useful part of the postal analogy for **packet switching**. A computer sends data in small units called **packets**. Network devices forward them towards their destinations, letting many transfers share the same links. Packets from one transfer *can* take different routes or arrive out of order, but sharing a link does not require either event. [The Internet Protocol specification](https://www.rfc-editor.org/rfc/rfc791.html) treats each datagram as an independent unit and does not promise end-to-end reliability or sequencing.

## Why send pieces at all?

Computer traffic is uneven. Someone clicks a link, a page loads, and then the connection may be quiet while they read. A dedicated circuit for that entire period would leave capacity idle between bursts. With packet switching, packets from different senders can take turns on one link. Imagine **Mira** sending two packets and **Jon** sending one while they share the same outgoing link:

| Turn on the link | Packet forwarded |
| ---: | --- |
| 1 | Mira's first packet |
| 2 | Jon's packet |
| 3 | Mira's second packet |

This is an illustrative order, not a scheduling rule. Jon's packet can use the link before Mira's transfer finishes. A router may hold packets briefly in a queue while the outgoing link is busy. The [Computer History Museum's account](https://www.computerhistory.org/revolution/networking/19/374) contrasts packet switching with traditional telephone circuits that held a path for a call.

Small pieces also limit how long one large transfer occupies a link before another packet can be sent. They make it possible to forward a packet after receiving that packet rather than waiting for an entire large message. The cost is extra information in each packet's header, plus the work of processing and queuing packets at routers. If too many packets compete for an outgoing link, queues grow, delay rises and packets may be discarded.

## What corresponds to what?

| Postal sorting office | Packet network |
| --- | --- |
| A short card in an addressed envelope | Data carried in a packet with a destination address |
| A sorting office | A router that forwards a packet to a next hop |
| Roads between offices | Network links between routers |
| Other people's mail in the same bags and vehicles | Other transfers sharing the same links |
| Cards arriving in an unexpected order | Packets arriving out of order |
| A recipient checking for missing cards | A receiving transport protocol or application checking its data |

The address is essential: a router does not need the whole letter to forward one packet. It examines the packet's destination and its own forwarding information to choose a next hop. The next router makes another forwarding decision. The [transit-map article](/how-a-transit-map-becomes-a-graph/) introduced the underlying shape: routers are vertices, links are edges, and a route is a path through that graph. A real network also has changing link conditions and routing rules, so the path is more than a line drawn once on a map. The [IP specification](https://www.rfc-editor.org/rfc/rfc791.html) describes both destination addresses and the forwarding decisions made by gateways, the earlier term for routers.

Here are the roles in the Internet example below. An application gives text to **TCP**, which puts successive bytes into **segments**. **IP** carries each segment in a packet, and routers forward those packets. At the destination, TCP uses byte positions to deliver an ordered stream to the application. The application decides where its message ends; TCP does not preserve message boundaries. [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) describes TCP's byte-stream service and the TCP segment carried in an IP datagram.

## Three pieces, two routes

Suppose an application sends the text **OPEN THE GATE**. In this teaching example, the text is encoded as ASCII, so each character, including each space, is one byte: **13 bytes** in all. TCP puts them into three segments, each carried in a separate IP packet. The table shows byte offsets starting at zero to make the positions visible; real TCP sequence numbers start from a value chosen for the connection.

![A sender and receiver connected by two paths. Pieces 1 and 3 travel through the North depot; piece 2 travels through the South depot. Piece 2 reaches the receiver first.](/images/packet-switching-two-routes.svg)

| Piece | Contents | Byte offsets | Route | Arrival order |
| --- | --- | ---: | --- | ---: |
| 1 | `OPEN ` | 0–4 | Sender → North depot → Receiver | 2nd |
| 2 | `THE ` | 5–8 | Sender → South depot → Receiver | 1st |
| 3 | `GATE` | 9–12 | Sender → North depot → Receiver | 3rd |

Piece 2 arrives first. Joining all three pieces in arrival order would produce **THE OPEN GATE** instead of **OPEN THE GATE**. TCP does not do that: it uses sequence numbers to place piece 2's bytes at offsets **5–8**, after piece 1's **0–4**. As the missing bytes arrive, TCP delivers the byte stream to the application in order. The packets need not arrive in order for the application to receive the intended text. [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) specifies TCP's sequence numbers and in-order service.

The diagram shows two possible paths, not a rule that every successive packet must use a different one. A routing change or a network's traffic-sharing policy can make paths differ. Often packets in one flow follow the same path. Even when they do, different delays and retransmissions can affect their arrival order. A second route helps only if the network knows about it and can use it; packet switching does not guarantee a way around every failure. The important property is that the network can forward each packet without reserving one end-to-end route for the whole transfer.

## What if an envelope never arrives?

Now imagine piece 1 is lost. Pieces 2 and 3 reaching the receiver do not magically restore `OPEN `. IP itself does not recover that missing data. TCP can detect a gap in the byte sequence, use acknowledgements to report what has arrived, and retransmit data that was not delivered. Only after the missing bytes arrive can it provide the stream in order. [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) describes the sequence, acknowledgement and retransmission mechanisms.

This is where the postal analogy needs care. A post office does not usually keep a numbered copy of every card and automatically send it again when the recipient notices a gap. Nor does every Internet application use TCP. The [User Datagram Protocol, or UDP](https://www.rfc-editor.org/rfc/rfc768), offers a simpler packet-oriented service without guaranteed delivery or duplicate protection; an application using it must add any recovery or ordering it needs. **Packet switching** describes how the network moves packets. **Reliable reconstruction** is an additional job, handled by TCP or by an application that chooses another approach.

## From an idea to working networks

Packet switching has more than one origin story. In the United States, **Paul Baran** studied a distributed communications network at RAND. His [1964 report](https://www.rand.org/pubs/research_memoranda/RM3420.html) described a network with redundant connections that could continue operating despite damaged parts. He called its small units *message blocks* and compared one to a letter carrying addresses. His aim was survivable communications, not a plan for the later public Internet.

In Britain, **Donald Davies** and colleagues at the National Physical Laboratory developed a related method for computer data communication. [NPL dates Davies's work to 1965](https://www.npl.co.uk/about-us/history/timeline); Davies's group introduced the term *packet*. Their concern included making shared links practical for the short, irregular bursts produced by computers. The two efforts were independent, and later network builders drew on several lines of research. [Lawrence Roberts's historical account](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0001-acc.pdf) describes how these ideas reached the ARPANET project.

Working networks followed. The **ARPANET** began operating in **1969**, and an NPL packet-switched network came online around **1969–70**, according to the [Computer History Museum's timeline](https://www.computerhistory.org/timeline/networking-the-web/). The ARPANET connected research computers so they could share resources. It was one important predecessor of the Internet, not the only packet network of its time.

The postal example leaves us with the central mechanism: **address each piece, let network nodes forward it across shared links, and handle order or loss at the endpoints when the application requires it**. A packet does not carry a reserved road from sender to receiver. It carries enough information for the network to move it towards its destination, one step at a time.

## Sources

- [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791.html), 1981. Independent datagrams, addressing, forwarding and the limits of IP's delivery service.
- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html), 2022. TCP's ordered byte stream, sequence numbers, acknowledgements and retransmission.
- [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768), 1980. UDP's minimal service and lack of delivery or duplicate guarantees.
- Paul Baran, [*On Distributed Communications: I. Introduction to Distributed Communications Networks*](https://www.rand.org/pubs/research_memoranda/RM3420.html), RAND, 1964. Distributed network design and survivability.
- [National Physical Laboratory, digital history timeline](https://www.npl.co.uk/about-us/history/timeline). Donald Davies's packet-switching work and the NPL network.
- Lawrence G. Roberts, [“The ARPANET and Computer Networks”](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0001-acc.pdf), 1986. A participant's account of Davies's terminology and the ARPANET's development.
- [Computer History Museum, *Connections: Global Networks*](https://www.computerhistory.org/revolution/networking/19/374). Packet switching and traditional telephone circuits.
- [Computer History Museum, *Timeline of Computer History: Networking & the Web*](https://www.computerhistory.org/timeline/networking-the-web/). Dates for the early ARPANET and NPL networks.

The senders, receiver, depots, message and arrival order are invented teaching examples. The feature image is AI-generated and depicts no particular historical post office. The diagram represents the fictional routes, not a measured Internet connection.
