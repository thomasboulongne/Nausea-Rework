### -*- mode: makefile; mode: auto-fill; -*-

# sensible default
RSYNC=rsync -ltc

# do nothing by default
all: 

# please include non generic target and definitions only in make.local file
include make.defs

ifndef MAKE_MODEL
$(error "ice make error: MAKE_MODEL is not defined")
endif

include Makefile.$(MAKE_MODEL)

include make.local
