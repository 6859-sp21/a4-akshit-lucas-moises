
# The Economic Lives of the Indian Poor

# Motivation

People's perceptions of those living in extreme poverty are often overly simplistic. A common image of the extremely poor is that they spend almost all of their incomes on food, and therefore have few consumption choices to make.

Inspired by Ester Duflo & Abhijit Banerjee's 2007 paper 'The Economic Lives of the Poor', we want to challenge this narrative. We want to show that consumption patterns of those living in poverty are complex, and in many ways, reflect the same challenges and trade-offs as in richer societies (e.g., tasty vs. nutritious food). 

India has one of the world's largest populations living in extreme poverty (https://blogs.worldbank.org/opendata/half-world-s-poor-live-just-5-countries). Further, two of our team members have personal connections to India and so we decided to start our project there.

# Data

## India Human Development Survey (IHDS) 2011-12

The India Human Development Survey 2011-12 is a nationally representative, multi-topic survey of 42,152 households in 1,503 villages and 971 urban neighborhoods across India (https://ihds.umd.edu/). It is a joint project by the University of Maryland, College Park; the National Council of Applied Economic Research (NCAER) in Delhi, and the Indiana University, and the University of Michigan.

Typically, the Consumer Expenditure Survey (CES, conducted by the Indian National Statistical Office is used to calculate national poverty statistics. However, the latest round of the CES has not yet been published – official, due to concerns regarding data quality, but some argue for political reasons (https://www.thehindu.com/business/Economy/what-is-consumer-expenditure-survey-and-why-was-its-2017-2018-data-withheld/article30063708.ece).

This makes the IHDS 2011-12 and the CES from 2011-12 the latest nationally representative surveys with detailed data on household consumption patterns. Since the IHDS is better documented and includes data on additional household characteristics we could use in future iterations, we decided to use the IHDS.

## Data Exploration and Preprocessing

We did some basic data exploration and extensive preprocessing of the data in R. 

Data pre-processing included the following steps:
- Filter data to select households that are poor according to the national poverty line (https://ihds.umd.edu/poverty)
- Merge in labels of consumption items to be displayed in the graph
- Categorize consumption items into groups
- Reshape household-level data to long format
- Harmonize reference periods of consumption items (i.e., rescale consumption of every item to Rupees spent over last 30 days)
- Estimate means using household survey weights

We ended up using the national poverty line as a threshold. However, we had also considered using the international poverty line of 1.90 International USD PPP per day. For this purpose, we calculated the total individual consumption value in Rupees per day and multiplied it with the PPP conversion factor provided by the World Bank and OECD. However, we found that the resulting poverty estimates were different from what was reported from other surveys. Using the poverty indicator already included in the dataset therfore seemed the safer choice.

# Visualization Design

## Promoting Self-Reflection

As we wanted people to reflect on their (mis-)perceptions of the spending patterns of the poor, we decided to use a narrative technique that promotes this kind of self-reflection: we first ask users to guess the share of each consumption category, and then juxtapose users' estimate to the real consumption statistics.

We iterated over several methods to collect user input. We started with simple sliders but found it took users too long to allocate 100%. Also, asking users to make estimates on the percent level seemed to invite false precision (e.g., users likely have no strong opinion on whether food consumption is 63% or 64%, so asking them to make such a precise estimate). We then shifted to text input, paired with buttons that increment by 5 percentage points. We also added a doughnut chart that updates as users make input so that users have immediate visual feedback of their input. Other ideas were to let users drag-and-drop money icons on different consumption categories or let them build the pie chart themselves but these solutions proved to be difficult to implement technically.

To facilitate the comparison of the user input and reality, we aligned the doughnut charts concentrically and made the color-coding consistent. 

## Abstract/Elaborate

We also wanted to give users a chance to explore the full granularity of our data without overwhelming them. Therefore, another design choice was to use a 'zoomable sunburst' chart, building on existing code (https://observablehq.com/@d3/zoomable-sunburst). If users want to better understand how spending is distributed within a consumption category, they can click on the consumption category.

## Limitations

The visualization still has some limitations. The concentric organization of the doughnut/sunbursts facilitates the comparison between user estimates and reality, but eventually, doughnut charts may not be the most effective encoding for visual comparisons (e.g., as discussed in class, angle and area are generally less effective encodings than length and position on a common scale).

Further, collecting user input is still not as intuitive as it could be. Users have to do some cognitive work to get to 100% if they change any of the default values, and the fact that they can temporarily allocate more than 100% may be confusing too.

# Other

## Division of Work 

Moises took the lead on the D3 visualization and CSS, Akshit took the lead on user interactions and project management, and Lucas took the lead on data exploration & processing, presentation, and write-up.

We estimate that in total we spent 30 people hours on this assignment.  

## References & Quick Links
- [Banerjee, A. V., & Duflo, E. (2007). The Economic Lives of the Poor. Journal of Economic Perspectives, 21(1), 141-168.](https://pubs.aeaweb.org/doi/pdfplus/10.1257/jep.21.1.141)
- [Demo Link](https://6859-sp21.github.io/a4-akshit-lucas-moises/)
- [India Human Development Survey 2011-12](https://ihds.umd.edu/)
- [Zoomable Sunburst D3 script](https://observablehq.com/@d3/zoomable-sunburst)