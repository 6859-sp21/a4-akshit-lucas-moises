
# A4 preprocessing code
library(tidyverse)

# set directory
setwd("~/Documents/04_Master/10_Courses/29_Data Visualization/a4-akshit-lucas-moises/")

# load data
load("01_data/02_household data (consumption)/36151-0002-Data.rda")
df <-  da36151.0002

# only keep relevant variables (consumption, survey weight, income)
df <- df %>%
  select(c(STATEID, DISTRICT, WT),starts_with("CO"))

# create income groups or filter below certain income threshold
# ...

# create summary (mean for each consumption item)
df <- df %>%
  gather("policy","support", -c(WT))



# Create summary data of control group
df_pp_c <- df_pp %>%
  select(c(final_weight,treatment,starts_with("pp_"))) %>%
  gather("policy","support", -c(final_weight,treatment))

df_pp_c <- df_pp_c %>%
  filter(treatment == 0) %>%
  filter(policy != "pp_marketpols") %>%
  filter(policy != "pp_remaining") %>%
  as_survey_design(weights = c(final_weight)) %>%
  group_by(policy) %>%
  summarize(n = survey_mean(support, na.rm = T, vartype = "ci"))


# reshape


df %>%
  gather("policy","support", -c(final_weight,treatment))



 