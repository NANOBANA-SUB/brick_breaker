#!/bin/perl
#!/usr/bin/env perl
use Dancer2;
use Plack::Builder;

my @scores;

# Get the top 10 scores
get '/scores' => sub {
    return \@scores[0..9];
};

# Receive a new score and save it
post '/score' => sub {
    my $username = body_parameters->get('username');
    my $score = body_parameters->get('score');
    if (!defined $username || !defined $score) {
        send_error("Invalid score submission", 400);
    } else {
        push @scores, {username => $username, score => $score};
        @scores = sort { $b->{score} <=> $a->{score} } @scores;
        return { message => 'Score received and saved' };
    }
};

# Adding CORS support
builder {
    enable "Plack::Middleware::CrossOrigin", origins => '*';
    start;
};
