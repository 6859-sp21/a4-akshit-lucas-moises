
# A4 preprocessing code
library(tidyverse)
library(srvyr) 
library(readr)


# set directory
setwd("~/Documents/04_Master/10_Courses/29_Data Visualization/a4-akshit-lucas-moises/")

# load data
load("01_data/02_household data (consumption)/36151-0002-Data.rda")
df <-  da36151.0002

# only keep relevant variables (consumption, survey weight, income) - inefficient code
df <- df %>%
  select(c(STATEID, DISTRICT, WT, POOR),starts_with("CO"))
df <- df %>% select(-ends_with("A"))
df <- df %>% select(-ends_with("B"))
df <- df %>% select(-ends_with("0C"))
df <- df %>% select(-ends_with("1C"))
df <- df %>% select(-ends_with("2C"))
df <- df %>% select(-ends_with("3C"))
df <- df %>% select(-ends_with("4C"))
df <- df %>% select(-ends_with("5C"))
df <- df %>% select(-ends_with("6C"))
df <- df %>% select(-ends_with("7C"))
df <- df %>% select(-ends_with("8C"))
df <- df %>% select(-ends_with("9C"))
df <- df %>% select(-ends_with("D"))
df <- df %>% select(-ends_with("E"))
df <- df %>% select(-(ends_with("T") & starts_with("CO")))

# merge in PPP conversion factor
df_ppp <- read_csv("02_preprocessing/ppp_converion_factor.csv")
conversion_factor <- df_ppp %>%
  filter(TIME == 2011) %>%
  filter(LOCATION == "IND") %>%
  select(Value)
conversion_factor <- pull(conversion_factor[1,1])

# Create daily household per capita in 2011 intl dollar
df <- df %>%
  mutate(COPC_INTL = COPC / conversion_factor) %>%
  mutate(COPC_INTL_DAY = COPC_INTL / 30.4167) %>%
  mutate(INTL_EXTR_POOR = (COPC_INTL_DAY <= 5.50))

summary(df$COPC)
summary(df$COTOTAL)
summary(df$COPC_INTL)
summary(df$COPC_INTL_DAY)
summary(df$INTL_EXTR_POOR)

# create income groups or filter below certain income threshold
summary(df$POOR)
df <- df %>%
  filter(POOR == "(1) poor 1")

# create summary (mean for each consumption item)
df <- df %>%
  gather("consumption_item","expenditure", -c(WT, DISTRICT)) # STATEID

# create means using survey weights
df$expenditure <-  as.numeric(df$expenditure)
df <- df %>%
  as_survey_design(weights = c(WT)) %>%
  group_by(consumption_item) %>%
  summarize(n = survey_mean(expenditure, na.rm = T, vartype = "ci"))
df <-  rename(df, mean = n)
df <- select(df, -n_low)
df <- select(df, -n_upp)

# replace consumption item codes with labels
df_labels <- read_csv("02_preprocessing/labels.csv")
df <- left_join(df, df_labels)

# rescale values based on recall period (e.g., make consistent to two weeks)
df <-  df %>% mutate(period_conversion = metric)
df$period_conversion <- as.numeric(recode(df$period_conversion, spent_in_last_365_days = "0.083333333333333333", paid_for_in_last_30_days = "1"))
df <-  df %>% mutate(mean = mean * period_conversion)

# export data
df <- df %>% select(variable, mean, category_1) %>% filter(!is.na(mean))
write.csv(df,"01_data/02_household data (consumption)/clean_sonsumption_data.csv", row.names = FALSE)


