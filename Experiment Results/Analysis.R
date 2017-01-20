rm(list=ls())
library(plyr)
library(boot)
library(lme4)
library(gridExtra)
source("~/Documents/Programming/R/useful.R")

my.mean = function(x, indices) {
  return( mean( x[indices] ) ) }

low.ci = function(vector) {
  vector.boot = boot(vector,my.mean,1000)
  return (boot.ci(vector.boot)$normal[2])
}

high.ci = function(vector) {
  vector.boot = boot(vector,my.mean,1000)
  return (boot.ci(vector.boot)$normal[3])
}

d <- read.csv("~/Documents/Linguistics/There + Conjoined Subject/Experiment/Results/Results-parsed.csv")

d = within(d, {
  conj = as.factor(ifelse(subject=='conj_sg' | subject=='conj_pl', 'yes', 'no'))
  numb = as.factor(ifelse(subject=='conj_sg' | subject=='sg', 'sg', 'pl'))
})

d$subject = factor(d$subject,levels(d$subject)[c(5,4,3,2,1)])
d$copula = factor(d$copula,levels(d$copula)[c(3,4,2,1)])
d$numb = factor(d$numb,levels(d$numb)[c(2,1)])

mean.rt = mean(d$rt)
sd.rt = sd(d$rt)

mistakes = subset(d, type=='filler' & grammaticality==1 & response > 3 & question_number >4)

mistakes = ddply(mistakes,'WorkerId',nrow)

d = merge(d,mistakes,by='WorkerId')

d = subset(d,abs(rt - mean.rt) < mean.rt + 2 * sd.rt & V1 < 9)

fillers = subset(d,type=='filler')
targets = subset(d,type=='target')
conj = subset(targets,conj=='yes')
nonconj = subset(targets,conj=='no')

fillers.means <- ddply(fillers, .(grammaticality), summarise,
             ratings = mean(response))

# targets.means <- ddply(targets, .(copula,numb,conj,WorkerId), summarise,
#              ratings = mean(response))
# 
# ms <- ddply(targets.means, .(copula,numb,conj), summarise,
#             mean = mean(ratings),
#             cil = low.ci(ratings),
#             cih = high.ci(ratings))

conj.means <- ddply(conj, .(copula,subject,WorkerId), summarise, ratings = mean(response))
nonconj.means <- ddply(nonconj, .(copula,subject,WorkerId), summarise, ratings = mean(response))

conj.ms = ddply(conj.means, .(copula,subject), summarise, mean = mean(ratings), cil = low.ci(ratings), cih = high.ci(ratings))

nonconj.ms = ddply(nonconj.means, .(copula,subject), summarise, mean = mean(ratings), cil = low.ci(ratings), cih = high.ci(ratings))

g_legend<-function(a.gplot){
  tmp <- ggplot_gtable(ggplot_build(a.gplot))
  leg <- which(sapply(tmp$grobs, function(x) x$name) == "guide-box")
  legend <- tmp$grobs[[leg]]
  legend
}

grid_arrange_shared_legend <- function(...) {
  plots <- list(...)
  g <- ggplotGrob(plots[[1]] + theme(legend.position="bottom"))$grobs
  legend <- g[[which(sapply(g, function(x) x$name) == "guide-box")]]
  lheight <- sum(legend$height)
  grid.arrange(
    do.call(arrangeGrob, lapply(plots, function(x)
      x + theme(legend.position="none"))),
    legend,
    ncol = 3,
    heights = unit.c(unit(1, "npc") - lheight, lheight))
}

# Color chart

nonconj.plot = ggplot(data=nonconj.ms, aes(x=subject, y=mean, fill=copula)) + theme(text=element_text(size=28))+ ylab('Mean Rating') + theme(axis.title.x = element_blank())  + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#C40F0F", "#108AD6", "#FFFC12"),name="Copula",labels=c("is","'s","are")) + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG','There be PL'))

conj.plot = ggplot(data=conj.ms, aes(x=subject, y=mean, fill=copula)) + theme(text=element_text(size=28)) + ylab('') + theme(axis.title.x = element_blank()) + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#C40F0F", "#108AD6", "#FFFC12"),name="Copula",labels=c("is","'s","are")) + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG & SG','There be PL & SG'))

legend = g_legend(nonconj.plot)

nonconj.plot = nonconj.plot + theme(legend.position="none")
conj.plot = conj.plot + theme(legend.position="none")

grid.arrange(nonconj.plot, conj.plot, legend, ncol=3, nrow=1, widths=c(5,5,1),top=textGrob("Acceptability Ratings by Copula and Subject Type",gp=gpar(fontsize=32,font=1)),bottom=textGrob("Subject Type",gp=gpar(fontsize=28,font=1)))

# ggplot(data=ms, aes(x=numb, y=mean, fill=copula)) + theme(text=element_text(size=24))+ ylab('Mean Rating') + xlab('Subject Type') + ggtitle('Acceptability Ratings by Copula and Subject Type') + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#C40F0F", "#108AD6", "#FFFC12"),name="Copula",labels=c("is","'s","are")) + facet_grid(.~conj,scales="free_x") + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG','There be PL','There be SG & SG','There be PL & SG'))

# Greyscale chart

nonconj.plot = ggplot(data=nonconj.ms, aes(x=subject, y=mean, fill=copula)) + theme(text=element_text(size=24))+ ylab('Mean Rating') + theme(axis.title.x = element_blank())  + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#FFFFFF", "#B0B0B0", "#686868"),name="Copula",labels=c("is","'s","are")) + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG','There be PL'))

conj.plot = ggplot(data=conj.ms, aes(x=subject, y=mean, fill=copula)) + theme(text=element_text(size=24)) + ylab('') + theme(axis.title.x = element_blank()) + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#FFFFFF", "#B0B0B0", "#686868"),name="Copula",labels=c("is","'s","are")) + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG & SG','There be PL & SG'))

legend = g_legend(nonconj.plot)

nonconj.plot = nonconj.plot + theme(legend.position="none")
conj.plot = conj.plot + theme(legend.position="none")

grid.arrange(nonconj.plot, conj.plot, legend, ncol=3, nrow=1, widths=c(4,4,1),top=textGrob("Acceptability Ratings by Copula and Subject Type",gp=gpar(fontsize=28,font=1)),bottom=textGrob("Subject Type",gp=gpar(fontsize=24,font=1)))

# ggplot(data=ms, aes(x=numb, y=mean, fill=copula)) + theme(text=element_text(size=24)) + ylab('Mean Rating') + xlab('Subject Type') + ggtitle('Acceptability Ratings by Copula and Subject Type') + coord_cartesian(ylim=c(1,7)) + scale_y_continuous(breaks=seq(1, 7, 01)) + geom_bar(colour="black", stat="identity",position=position_dodge()) + geom_errorbar(aes(ymin=cil, ymax=cih),width=.2,position=position_dodge(.9)) + scale_fill_manual(values=c("#FFFFFF", "#B0B0B0", "#686868"),name="Copula",labels=c("is","'s","are")) + facet_grid(.~conj,scales="free_x") + theme(strip.background = element_blank(), strip.text.x = element_blank()) + scale_x_discrete(labels=c('There be SG','There be PL','There be SG & SG','There be PL & SG'))

# other red 781515

t.test(response ~ copula,data=subset(targets,subject=='pl'&copula != ' are'))
t.test(response ~ copula,data=subset(targets,subject=='conj_pl'&copula != ' are'))
t.test(response ~ subject,data=subset(targets,copula==' is'&subject != 'conj_sg'&subject != 'sg'))
t.test(response ~ subject,data=subset(targets,copula=="'s"&subject != 'conj_sg'&subject != 'sg'))

mod = lmer(response ~ subject * copula + (subject + copula | WorkerId),data=targets)
