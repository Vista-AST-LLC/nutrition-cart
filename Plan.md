//********TODS********
// 1) Determine best layout for application
// 2) Fix Food Label entry field
// 3) Research best way to cacluate nutrition score
// 4) Resolve responsivness issues Ex) Table
// 5) Replace age question page with ???? */  


# Page 1: Instructions (this may be put in the slideshow)
## Some ideas to gamify:
    Have some unique requirements for each day, such as pizza on Thursday
    Have a special "Diet Day" that has stricter requirements for a higher score
    Punish score when having duplicate items on sequential days
    Have a maximum of 3 (or perhaps 2) of the same item in the week
    In page 2, have a special "Quests" type box that has additional requirements abstract from a specific day
        For example, "Different lunch every day", or "No snacks between meals (dessert allowed)"

# Page 2: Calendar view of a week (M-F)
    Each day will have its own separate daily mealplan
    The calendar days should be clickable, each day leading to its own Activity (Page 3) page
    There will be a "Submit" or "Finalize Mealplan" button that will lead to page 4

# Page 3: Activity (scanning cards, putting together the mealplan)
    What day is being worked on (and special requirements, if any)
    Input box (for manual typing if needed)
    Display for Breakfast, Lunch, Dinner, and Dessert/Snacks
    
# Page 4: Grade 
    Each day will have its own score, and the week's score will be the average of the 5 days
    There will be a breakdown of each day with comments saying what was done well and what could be better
    There will be a "Keep Working"-type button that will return Page 2 and allow changes for resubmittion 

## Calories
    0-1000: 0 points awarded (there is a need for calories to live)
    1000-1500: Increase to maximum awarded score
    1500-2500: Stay at max (range of acceptable values, with leeway given for weight, sex, etc)
    2500-4000: Decrease to 0 points (more than 4000 is 0)

## Total Fat
    0-25g: Increase from 0 to max score
    25-50g: Stay at max
    50-100g: Decrease from max to 0

## Sat Fat
    0g: Start at max scone
    0-10g: Stay at max
    10-20g: Decrease from max to 75% of max
    20-40g: Decrease to 0 (more that 40 will stay at 0)

## Trans Fat
    0g: Start at max score 
    0-5g: Decrease from max score to 0 points (Should limit as much as possible according to many sources)

## Cholesterol
    0mg: Max points (there is no recommended minimum for cholesterol)
    0-200mg: Slow decrease in points to about 75% of max
        200-500mg: Decrease from 75% to 0 (more than 500 is also 0 points)

## Sodium
    0-500mg: Sharp increase in points to maximum (Recommended daily minimum)
    500-1500mg: Stay at max score (Many sources say less is better)
    1500-2300mg: Slight decrease in score (2300 is AHA recommended maximum)
    2300-4000mg: Decrease in score to 0 points (more than 4000 is also 0 points awarded)

## Total Carbohydrates
    0-50g: 0 points
    50-150g: Increase from 0 to 50% points
    150-200g: Increase to max score
    200-275g: Stay at max
    275-500: Decrease to 0 points (more than 500 is 0 points)

## Dietary Fiber
    0-28g: Increase from 0 to max score
    28-38g: Stay at max (acceptable range of fiber)
    38-100g: Decrease from max to 0 (there is no recommeded maximum)

## Sugar
    0g: Start at max (no minimum is needed)
    0-30g: Stay at max score
    30-50g: Decrease to 50% of max
    50-100: Decrease to 0% of max

## Protein
    0-20g: 0 points (need more protein, especially for growing teens)
    20-50g: Increase from 0 to max score
    50-75g: Stay at max
    75-150g: Decrease from max to 50%
    150g+: Stay at 50% (no recommened maximum)

