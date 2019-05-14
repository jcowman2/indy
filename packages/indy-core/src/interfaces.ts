/*
 * Common private interfaces for Indy Core.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

export type Provider<Args, Result> = (args: Args) => Result;
