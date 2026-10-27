---
title: "How a Noisy Telegraph Explains Error-Correcting Codes"
subtitle: "How three overlapping checks can find and repair one changed bit"
description: "A seven-signal message shows how Hamming codes use extra bits to locate a transmission error, how the method arose, and what it cannot repair."
sequence: 17
category: "Information theory"
historicalPeriod: "1948–1950"
author: "Attila Kulik"
tags: ["Error-correcting codes", "Hamming code", "Information theory", "Parity"]
heroImage: "/images/noisy-telegraph-error-correction-feature-photo.jpg"
heroImageAlt: "Brass telegraph key on a wooden workbench beside a paper tape receiver under a warm desk lamp"
pubDate: 2026-10-27
draft: false
---

Imagine sending a message over a telegraph-like line. At each regular interval you send one of two signals, which we will write as `0` or `1`. A burst of interference changes one signal on the way. The receiver sees the changed message, but has no copy of the original to compare it with. How could the receiver know which signal to put back?

An **error-correcting code** sends carefully chosen extra information alongside the message. The extra information makes some received patterns recognisably wrong and, within limits, identifies what changed. We will use a seven-bit **Hamming code** to repair one flipped bit without asking the sender to transmit the message again.

## Why one check is not enough

A **bit** is a `0` or a `1`. Suppose your four-bit message is `1011`, which contains three `1`s. You can add a **parity bit** of `1` so that the five transmitted bits, `10111`, contain an even number of `1`s: four. The receiver counts again. An odd count means that something changed.

That single check has limits. If one bit flips, the count changes from even to odd, so the receiver detects an error but cannot tell *which* bit flipped. If two bits flip, the count stays even and this check misses them. A parity bit reports a problem; it does not provide enough information to repair it. [Hamming's 1950 paper](https://doi.org/10.1002/j.1538-7305.1950.tb00463.x) begins with this single-check construction before building codes that can correct errors.

## What led Hamming to the problem

Claude Shannon's [1948 paper on communication](https://reach.ieee.org/primary-sources/a-mathematical-theory-of-communication/) treated noise as part of the problem of getting a message from sender to receiver. Richard W. Hamming worked on a more specific question at Bell Laboratories: how could a computer recover when a bit was wrong? In [his later account](https://garfield.library.upenn.edu/classics1982/A1982NY35700001.pdf), he described his work with relay computers that had error detection and his concern that an undetected failure could spoil a long computation.

Hamming's [“Error Detecting and Error Correcting Codes”](https://doi.org/10.1002/j.1538-7305.1950.tb00463.x) appeared in April 1950. It described codes for detecting a single error, correcting a single error, and correcting a single error while distinguishing it from a double error. The telegraph line here is a teaching setting: Hamming's stated starting point was reliable computation, not a particular historical telegraph system.

## Give every position a pattern of checks

You still want to send `1011`. Put those four **data bits** in positions 3, 5, 6 and 7 of a seven-bit block. Reserve positions 1, 2 and 4 for three **check bits**, which we will call `p1`, `p2` and `p4`. Choose each check bit so that its overlapping group contains an even number of `1`s.

- `p1` checks positions **1, 3, 5 and 7**. The data bits there are `1, 0, 1`: two `1`s. Set `p1` to `0` to keep the count even.
- `p2` checks positions **2, 3, 6 and 7**. The data bits are `1, 1, 1`: three `1`s. Set `p2` to `1` to make four.
- `p4` checks positions **4, 5, 6 and 7**. The data bits are `0, 1, 1`: two `1`s. Set `p4` to `0`.

The complete block, read from position 1 to position 7, is **`0110011`**. This is a Hamming(7,4) code: seven transmitted bits contain four message bits and three check bits. The diagram shows which positions each check covers; every numbered position belongs to a distinct combination of groups.

![Seven-bit Hamming code 0110011. Positions 1, 2 and 4 hold check bits. Check p1 covers positions 1, 3, 5 and 7; p2 covers 2, 3, 6 and 7; p4 covers 4, 5, 6 and 7.](/images/noisy-telegraph-hamming-checks.svg)

The overlapping groups are the useful part. Position 6, for example, belongs to the `p2` and `p4` groups but not the `p1` group. Position 3 belongs to `p1` and `p2` but not `p4`. A changed bit leaves a different pattern of failed checks depending on its position.

## Let one signal change

Suppose interference flips the `1` in position **6** to `0`. The receiver gets **`0110001`** instead of `0110011`. It repeats the three even-parity checks on the received block:

- `p1` sees `0, 1, 0, 1`: **two `1`s, so it passes**.
- `p2` sees `1, 1, 0, 1`: **three `1`s, so it fails**.
- `p4` sees `0, 0, 0, 1`: **one `1`, so it fails**.

The failed checks are `p2` and `p4`. Their labels add to **2 + 4 = 6**, the position of the bad bit. Flip position 6 back to `1`, and the block becomes `0110011` again. Reading data positions 3, 5, 6 and 7 returns the original message, `1011`.

The three pass/fail results form a **syndrome**: a small diagnostic pattern. A check that fails contributes its position number, so the syndrome points to a bit position from 1 through 7. If all three checks pass, its value is zero. This works because every position has a unique membership pattern across the three groups.

## What the extra bits can and cannot do

This seven-bit code has a **minimum distance** of three: any two valid blocks differ in at least three positions. That spacing is why one changed bit can be corrected. A received block one bit away from the original valid block cannot also be one bit away from a different valid block. It also means two changed bits produce an invalid block, so they can be *detected* if the receiver only checks validity.

There is a catch. The three-check syndrome does not say whether one bit or two bits changed. If two bits flip and the receiver blindly treats the syndrome as a one-bit location, it can flip a third bit and deliver the wrong message. Hamming's paper also described adding another, overall parity check to distinguish a single-bit error from a double-bit error: the familiar **single-error correction, double-error detection** approach. More errors require other protections or a request to send the data again.

The cost is visible even in our small example: seven bits travel to carry four bits of message, so **three of the seven transmitted bits are checks**. That overhead buys recovery from any single-bit flip in a seven-bit block. Real systems choose codes and block sizes according to the errors they expect and the cost of extra data or retransmission. For example, [IBM describes error-correcting memory](https://www.redbooks.ibm.com/redbooks/pdfs/sg247196.pdf) that corrects single-bit faults, while [space communication standards](https://ccsds.org/Pubs/130x0g2s.pdf) use other coding schemes suited to long-distance links. Those systems need not use the exact seven-bit example shown here.

The telegraph picture has limits too. A historical Morse message was not a string of equally timed `0`s and `1`s, and interference may erase a signal or shift its timing rather than simply flip one bit. Our line stands for any channel in which the receiver knows each bit's position in a fixed-length binary block and at most one bit changes. Within that model, the central idea is precise: **overlapping checks turn “something went wrong” into “bit 6 went wrong.”**

## Sources

- Claude E. Shannon, [“A Mathematical Theory of Communication”](https://reach.ieee.org/primary-sources/a-mathematical-theory-of-communication/), *The Bell System Technical Journal*, 1948. Background on communication over noisy channels.
- Richard W. Hamming, [“Error Detecting and Error Correcting Codes”](https://doi.org/10.1002/j.1538-7305.1950.tb00463.x), *The Bell System Technical Journal*, April 1950. Original parity and error-correction constructions.
- Richard W. Hamming, [1982 retrospective on the 1950 paper](https://garfield.library.upenn.edu/classics1982/A1982NY35700001.pdf). His account of the computing problem that motivated the work.
- IBM, [*System p5 Approaches to 24x7 Availability*, chapter 2](https://www.redbooks.ibm.com/redbooks/pdfs/sg247196.pdf). Example of error-correcting memory.
- Consultative Committee for Space Data Systems, [*Overview of Space Communications Protocols*, section 3.2.4](https://ccsds.org/Pubs/130x0g2s.pdf). Example of channel coding on space links.

The telegraph scene, message `1011` and flipped bit are teaching examples. The feature image is AI-generated, not a historical photograph or a diagram of an actual telegraph installation.
