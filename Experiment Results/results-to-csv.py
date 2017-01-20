# This file is a template for converting the JSON file that MTurk will return to you into a .csv which you can import into R, Excel, etc. Here we're operating on the assumption that you're using mmturkey (https://github.com/longouyang/mmturkey) or some comparable process in your JavaScript to communicate results to MTurk.

# Note that this script might need further modification, depending on how you recorded your data. If you follow the instructions below in encoding your data in the JavaScript, or use the sample experimental template provided with Submiterator, you can get away with just filling in a few values.

# This code assumes that what was submitted to MTurk was a JavaScript object (dictionary) where each trial was encoded as a separate object (dictionary), like so:

# data = {
#     q1: {
#         ...
#     },
#     q2: {
#         ...
#     },
#     ...,
#     q20: {
#     ...
#     }
# }

# If you know a but of Python you could easily modify this to take the case where your data is stored in an array, but it's probably easier to just change your JavaScript code to follow this format.

# MTurk will return a JSON with one line per participant, with 'workerid', Answer.q1', 'Answer.q2', etc. in the header line. The goal is to converr this into a .csv file with one line per trial, where each trial is labeled with all relevant information about the participant (workerid, demographic, etc) as well as all of the data recorded in the trial.

# Add to the bySubjectVariables list any information which appears 1x per participant that you want access to in data analysis. One item in this list should always be 'workerid'.
# Values recorded trial-by-trial should not be named in bySubjectVariables, since they will automatically be added to the byTrialVariables list when the individual trial reulsts are parsed. (It's critical here that exactly the same variables are recorded in each trial. Add dummy variables with NAs in your JavaScript if your experiment isn't set up like this.)

filename = "Results-raw-anon.csv"
bySubjectVariables = ['WorkerId', 'AcceptTime','SubmitTime','Answer 53']
byItemVariables = ['type','grammaticality','sentence','response','rt','locative','subject','copula','question_number']

import re
import csv
import json

input=open(filename, 'r')
output = open(filename.strip('-raw-anon.csv') + '-parsed-anon.csv', 'w')
header = bySubjectVariables + byItemVariables

reader = csv.DictReader(input)
writer = csv.DictWriter(output, header)

writer.writeheader()

for line in reader:
	subject_dict = {}
	for field in bySubjectVariables:
		subject_dict[field] = line[field]
	for field in byItemVariables:
		subject_dict[field] = ''
	for key in line.keys():
		if line[key] and line[key][0]=='{':
			new_row = subject_dict
			new_row['question_number'] = key.strip('Answer ')
			for key2 in json.loads(line[key]).keys():
				if key2 in byItemVariables:
					new_row[key2] = json.loads(line[key])[key2]
			writer.writerow(new_row)
