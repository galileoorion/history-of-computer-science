---
title: "How a Weather Forecast Explains Markov Chains"
subtitle: "How one-day probabilities tell us what can happen two days from now and in the long run"
description: "Use a two-state weather model to calculate a two-day forecast, then see how Markov chains describe patterns in Pushkin’s verse and links on the web."
sequence: 19
category: "Computer science"
historicalPeriod: "1913–1998"
author: "Attila Kulik"
tags: ["Markov chains", "Probability", "Stationary distributions", "PageRank", "Computing history"]
heroImage: "/images/markov-chains-weather-feature.jpg"
heroImageAlt: "A rain-soaked park path curves past an empty green bench as sunlight breaks through the clouds"
pubDate: 2026-11-20
draft: false
---

Suppose today is dry. A simple weather model gives tomorrow a 20% chance of rain. What are the chances it will rain the day after tomorrow? You have to allow for two possibilities. If tomorrow is dry, the chance of rain the following day is 20%. If tomorrow is rainy, that chance rises to 60%.

A **Markov chain** lets us combine those possibilities. It describes a system that moves between **states** according to probabilities. Once you know the current state, the earlier states add no information about the chances of the next one. This is the **Markov property**. In this model, today’s weather tells you which probabilities to use for tomorrow. [Robert Gallager’s chapter on finite-state Markov chains](https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/resources/mit6_262s11_chap03/) gives the formal definition.

## Give each state its own probabilities

Classify each day as **dry** or **rainy**, and take one step per day. Use these made-up probabilities for every step.

| Today | Dry tomorrow | Rainy tomorrow |
| --- | ---: | ---: |
| Dry | 80% | 20% |
| Rainy | 40% | 60% |

This table is the **transition matrix**. The row is where you are, and the column is where you land after one step. Each row adds up to 100% because the next day falls into exactly one of the two states. A transition can also leave you in the same state, as when one dry day follows another. In a diagram, those transitions appear as loops.

![Dry loops to Dry with 80% probability and points to Rainy with 20%. Rainy loops to Rainy with 60% probability and points to Dry with 40%.](/images/markov-chains-weather-transitions.svg)

The last two days could have been dry and dry, or rainy and dry. In either case, the current state is dry, so the model uses the same 20% chance of rain tomorrow. Successive days can still be dependent. Knowing that today is rainy raises tomorrow’s chance of rain from 20% to 60% compared with a dry day.

## Work out the chance of rain in two days

Starting from a dry day, there are two ways to reach a rainy day two steps later. Multiply the probabilities along each path.

| Path from today to the day after tomorrow | Probability |
| --- | ---: |
| Dry → Dry → Rainy | 0.80 × 0.20 = 16% |
| Dry → Rainy → Rainy | 0.20 × 0.60 = 12% |

Add the two results to get **28%**. The paths are mutually exclusive because tomorrow can have only one state. The calculation gives the chance of rain *on* the second day. If you want the chance of rain *at any point* over the next two days, include the Dry → Rainy → Dry path as well. That adds 8 percentage points, giving 36%.

You can repeat the calculation without listing every path. At each step, take the current probabilities of dry and rainy weather and distribute them using the two rows of the table. In matrix terms, you multiply the current row of probabilities by the transition matrix once for each day. [Gallager’s treatment of multistep transitions](https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/resources/mit6_262s11_chap03/) gives the general rule.

## When the probabilities settle

Keep stepping forward, and the chance of a rainy day approaches one third, whether you start on a dry day or a rainy one. To see where that fraction comes from, imagine the current probabilities are two thirds dry and one third rainy. In one step, one fifth of the dry probability moves to rainy, and two fifths of the rainy probability moves to dry. Both transfers are 2/15, so they balance.

That stable split is the **stationary distribution**. The weather can still change from one day to the next. What stays fixed is the probability assigned to each state. If today’s rain probability is *r*, tomorrow’s is `0.20 × (1 − r) + 0.60 × r`, or `0.20 + 0.40 × r`. So each step reduces any gap from one third to 40% of its previous size.

Some chains behave differently. If the rules forced the weather to alternate every day, a forecast starting on a known dry day would keep bouncing between 0% and 100% rain, even though a 50–50 split would be stationary. [Gallager discusses when a chain converges](https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/resources/mit6_262s11_chap03/).

## From Pushkin’s verse to web pages

In 1913, the Russian mathematician **Andrei Markov** published a study of 20,000 letters from Alexander Pushkin’s *Eugene Onegin*. He left out the Russian hard and soft signs and classified the letters in his sample as vowels or consonants. He counted adjacent vowel pairs and used that count and the letter totals to estimate how often a vowel followed each category. The estimates were about 13% after a vowel and 66% after a consonant. The gap showed why the preceding letter mattered. Markov also examined groups of three letters to see how much a longer history could improve the model. [Markov’s 1913 paper, in English translation](https://alpha60.de/research/markov/DavidLink_AnExampleOfStatistical_MarkovTrans_2007.pdf).

In 1998, **Sergey Brin and Lawrence Page** described the reasoning behind PageRank, a score used by their early Google search engine. Imagine a reader who usually follows a randomly chosen link from the current page and occasionally jumps to a random page. The page is the state, and one click or jump is a step. A page’s PageRank is its share of visits in the long run under that model. The weather example uses the same kind of calculation to find a long-run share for rainy days. [Brin and Page’s original Google paper](https://snap.stanford.edu/class/cs224w-readings/Brin98Anatomy.pdf).

## Choosing what the state should remember

The two-state forecast assumes that today’s label captures everything the model needs for tomorrow. You can test that assumption with weather records. Split dry days into two groups. Put dry days that followed rain in one group and dry days that followed another dry day in the other. Then compare how often it rained the next day in each group. If the difference holds up on fresh data, you could define the state using the last two days. Then **rainy → dry** and **dry → dry** would be distinct states with their own probabilities.

The choice of state determines which histories the model treats alike. A two-day state lets the chain use more of the weather record, but it also gives you more transition probabilities to estimate. The practical question is how much history you need to carry forward to make the next step predictable enough for the job.

## Sources

- A. A. Markov, 1913. Study of vowel and consonant sequences in Pushkin, translated by Gloria Custance and David Link for *Science in Context*. [English translation](https://alpha60.de/research/markov/DavidLink_AnExampleOfStatistical_MarkovTrans_2007.pdf)
- Robert G. Gallager, 2011. Definitions, multistep transitions and stationary distributions. [*Discrete Stochastic Processes*, chapter 3](https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/resources/mit6_262s11_chap03/)
- Sergey Brin and Lawrence Page, 1998. PageRank and its random-surfer model. [*The Anatomy of a Large-Scale Hypertextual Web Search Engine*](https://snap.stanford.edu/class/cs224w-readings/Brin98Anatomy.pdf)
